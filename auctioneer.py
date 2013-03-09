#!/usr/bin/env python

# Machinery for holding auctions

def main():
    pass

def unique_groups(allocs):
    '''Strip out the duplicates in the allocs'''
    # Hash each allocation.
    # Not as dynamic as it could be, but I'm still a little proud of this one
    condensed = set((frozenset({(k, v) for k, v in Z.iteritems()})
                     for i, Z in enumerate(allocs)))
    reduced = [dict(i for i in A) for A in condensed]
    return reduced

def attempt_filter_imba(allocs):
    '''Strip out duplicates, and remove imbalanced auctions from results
    NOTE: It is possible that all results are imbalanced, in this case, returns
    the alloc set unaltered'''
    if all(i[1][-1] == True for i in allocs):
        return allocs
    else:
        return(filter(lambda x: x[1][-1] == False, allocs))

def mean(iterable, key=lambda x: x):
    s, n = 0, 0
    for i in iterable:
        n += 1
        s += key(i)
    if n == 0:
        raise ValueError('Empty iterable')
    return s / float(n)


def variance(iterable, key=lambda x: x):
    s, n = 0, 0
    mu = mean(iterable, key)
    for i in iterable:
        n += 1
        s += (key(i) - mu) ** 2
    if n == 0:
        raise ValueError('Empty iterable')
    return s / float(n)

def mean_variance(iterable, key=lambda x: x):
    '''
    Returns (mean, variance) tuple.
    WARNING: not accurate for large scale differences.
    '''
    s, s2, n = 0, 0, 0

    for i in iterable:
        s += key(i)
        s2 += key(i) ** 2
        n += 1
    mean = float(s) / n
    return mean, float(s2) / n - (mean / n) ** 2

class Agent(object):
    '''Each agent has a list of bids, and some identification information'''
    def __init__(self, index, bids):
        '''
        index: the Agent_id from the db
        bids: an iterable of (item_id, bid_value) tuples
        '''
        self.id = index
        bids = filter(lambda x: x[1] != 0, bids)  # We cannot have zero-value
        self.bids = dict(bids)

    def __repr__(self):
        return '<Agent %s>' % (self.id)


class Auction(object):
    '''Holds agents within a single auction context.
    Allocations can be viewed at any time, but are not relevant until
    Auction.resolve() is called.

    Currently Built to find the 'best' allocation, although this has
    not been rigorously proven.

    This attempts to solve the problem min(variance(map(loss, Agents)))
    NOT min(regret)
    '''

    def __init__(self, auction_id, agents, **kwargs):
        self.id = auction_id
        self.agents = agents
        self.complete = False

        # Generate a single table containing all items and participants
        items = {k for A in agents for k in A.bids}  # unique item_id
        bid_table = {}
        for item_id in items:
            a_bids = {}
            for a in self.agents:
                if item_id in a.bids:
                    a_bids[a.id] = a.bids[item_id]
            bid_table[item_id] = a_bids
        self.bid_table = bid_table
        self.allocs = dict((k, None) for k in items)

    def __repr__(self):
        return '<Auction %s>: of %s' % (self.id, [a.id for a in self.agents])

    def reset_allocs(self):
        items = {k for A in self.agents for k in A.bids}
        self.allocs = dict((k, None) for k in items)
        return None


    # TODO: keep track of these dynamically which should be dramatically
    #       faster for larger auctions, but as it is, this is a prototype

    # Core Agent metrics
    def loss(self, A):
        '''The sum all bids lost by an agent. A = Agent ID'''
        l = 0
        for item_id, agent_id in self.allocs.iteritems():
            # If the Agent was not awarded the item
            if (agent_id is not None
                and A in self.bid_table[item_id]
                and A != agent_id):
                l += self.bid_table[item_id][A]
        return l

    def fulfillment(self, A):
        '''The sum of all bids won by an agent. A = Agent ID'''
        f = 0
        for item_id, agent_id in self.allocs.iteritems():
            # If the Agent was awarded the item
            if agent_id is not None and A == agent_id:
                f += self.bid_table[item_id][A]
        return f

    # Core aggregate metrics
    def regret(self):
        '''sum of loss function for all agents'''
        return sum(self.loss(a.id) for a in self.agents)

    def actualization(self):
        '''sum of all fulfillment'''
        return sum(self.fulfillment(a.id) for a in self.agents)

    def demand(self, item):
        '''Sum of all bids for an auction'''
        assert item in self.bid_table
        return sum(bid for bid in self.bid_table[item].itervalues())

    # Utility
    def contingent(self, contingency, fn):
        '''Evaluates fn with contingent state'''
        cur = (contingency[0], self.allocs[contingency[0]])
        self.allocs.update(dict([contingency]))
        z = fn()
        self.allocs.update(dict([cur]))
        return z

    def marginal_regret_table(self, item):
        '''Return the marginal regret table for each agent'''
        assert item in self.bid_table
        marginals = None
        R_gross = sum(v for v in self.bid_table[item].itervalues())
        marginals = [(a, R_gross - self.bid_table[item][a])
                     for a in self.bid_table[item]]
        return marginals

    def loss_table(self):
        '''Returns current loss for each agent'''
        return dict((k.id, self.loss(k.id)) for k in self.agents)

    def fulfillment_table(self):
        return dict((k.id, self.fulfillment(k.id)) for k in self.agents)

    def lmb_table(self, item, ZETA=0.2):
        '''Return the loss-modified bid table for each agent'''
        loss_map = dict((k, self.loss(k) * ZETA) for k in self.bid_table[item])
        return [(k, self.bid_table[item][k] + loss_map[k]) for k in loss_map]

    def allure(self, item):
        '''Designed to improve upon 'demand' by using information about
        short-horizon outcomes.

        specifically the "Expected loss-modified marginal regret."
        '''
        lm_bids = self.lmb_table(item)
        master = dict(lm_bids)
        total = sum(k[1] for k in lm_bids)
        for k, v in self.marginal_regret_table(item):
            master[k] = master[k] / float(total) * v
        return sum(v for v in master.itervalues())

    # Decision Engines - all return the agent who should be awarded the item
    # All methods return a (agent, strength) tuple, where strength is a percent
    # value. High strength means the selector distinguishes well between the
    # best values (1 is perfect), (0 is a tie)

    def bb_selector(self, item):
        '''Best-bid selector:
        Item is awarded to the agent with the highest bid. This is the
        traditional auction model.

        Strength:
        0: Tie, 1: otherwise
        '''
        assert item in self.bid_table
        bids = sorted(((a, b) for a, b in self.bid_table[item].iteritems()),
                                            key=lambda x: x[1], reverse=True)
        if len(bids) == 1:
            return (bids[0][0], 1)
        else:
            if bids[0][1] == bids[1][1]: # it was a tie
                return (bids[0][0], 0)
            return (bids[0][0], 1)

    def lmbb_selector(self, item, ZETA=0.2):
        '''Loss-Modified Best Bid Selector:
        Item is awarded to the agent with the highest loss-modified bid (LMB)
        LMB = bid + loss(Agent) * ZETA

        This method biases decisions towards agents who have lost a lot
        Strength:
        tie: 0.5
        singular: 1
        otherwise: lmbid1 / (lmbid1 + lmbid2)
        '''
        assert item in self.bid_table
        lm_bids = sorted(self.lmb_table(item, ZETA), key=lambda x: x[1], reverse=True)
        if len(lm_bids) == 1:
            return (lm_bids[0][0], 1)
        else:
            S = lm_bids[0][1] / float(lm_bids[0][1] + lm_bids[1][1])
            return (lm_bids[0][0], S)

    def mf_selector(self, item):
        '''Marginal fulfillment selector:
        Item is awarded to the agent who would have the most relative
        fulfillment. This biases decisions towards agents who have not
        been awarded much.

        Strength:
        singular = 1
        otherwise  (f1 / (f1 + f2))
        '''
        assert item in self.bid_table
        Fs = []
        for p in self.bid_table[item].iterkeys():
            f0 = self.fulfillment(p)
            f1 = f0 + self.bid_table[item][p]
            Fs.append((p, float(f0) / f1))

        Fs.sort(key=lambda x: x[1], reverse=True)
        if len(Fs) == 1:
            return (Fs[0][0], float(1))
        else:
            if Fs[0][1] == Fs[1][1]:
                S = 0.5
            else:
                S = Fs[0][1] / float(Fs[0][1] + Fs[1][1])
            return (Fs[0][0], S)

    def ma_selector(self, item):
        '''Degenerates to marginal fulfillment selector'''
        return self.mf_selector(item)

    # Optimization
    def resolve_uncontested(self):
        '''Pre-allocate all items that are not contested'''
        for item_id in self.bid_table:
            keys = self.bid_table[item_id].keys()
            if len(keys) == 1:  # Item is uncontested
                self.allocs[item_id] = keys[0]
        return

    def hybrid_selector(self, item, KAPPA=15):
        '''Looks at system state and determines the best strongest selector'''

        # mf is stronger early on (when regret is low)
        # lmbb is stronger later on (to recover)

        # I'm going to arbitrarily use MF when self.regret < 30 * len(agents)
        # This is a general 1/3 of the way through the item list when we switch
        # to lmbb
        if self.regret() == 0:
            return self.mf_selector(item)[0]
        lmbb_victor, lmbb_S = self.lmbb_selector(item)
        mf_victor, mf_S = self.mf_selector(item)
        if self.regret() < KAPPA * len(self.agents):
            return mf_victor
        else:
            return lmbb_victor

    def resolve(self, selector, **kwargs):
        '''Resolve the auction. After the initial allocation of uncontested
        items, items are awarded in order of descending rank values.
        i.e. map(rank, items).sort(reverse=True)'''
        # TODO: Arbiter function is not necessary if we only use one decision
        #       engine

        self.resolve_uncontested()
        allocations = []
        remaining_items = [k for k in self.bid_table
                             if self.allocs[k] is None]
        remaining_items.sort(key=self.allure)

        while len(remaining_items) > 0:
            item = remaining_items.pop()
            victor = selector(item)
            self.allocs[item] = victor
            allocations.append((item, victor))
            remaining_items.sort(key=self.allure)
        self.complete = True
        return allocations

    def loss_metric(self, fn=mean_variance):
        '''Returns the result of fn(self.loss_table.itervalues())'''
        return fn(self.loss_table().itervalues())

    def fulfillment_metric(self, fn=mean_variance):
        return fn(self.fulfillment_table().itervalues())

    def is_imba(self):
        '''Did someone get totally screwed, and not win a single bid'''
        agents = {i.id for i in self.agents}
        for v in self.allocs.itervalues():
            if v in agents:
                agents.remove(v)
        if len(agents) > 0:
            return True
        else:
            return False

    def multi_resolve(self):
        '''returns a list of (allocations, scores) tuples'''
        # Lambdas necessary as to strip out the weights
        selectors = [lambda x: self.bb_selector(x)[0],
                     lambda x: self.lmbb_selector(x)[0],
                     lambda x: self.mf_selector(x)[0],
                     self.hybrid_selector]
        results = []
        for sel in selectors:
            self.resolve(sel)
            score = (self.loss_metric(), self.fulfillment_metric(), self.is_imba())
            results.append((self.allocs.copy(), score))
            self.reset_allocs()
        return results


if __name__ == '__main__':
    main()
