#!/usr/bin/env python

def main():
    pass

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

    def is_finished(self):
        if (self.complete or
            all(map(lambda x: x is not None, self.allocs.itervalues()))):
            self.complete = True
            return True
        else:
            return False

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
        '''Designed to rank the extent to which a single-item multi-participant
        scenario will dramatically effect the core metrics.

        Illustration:  Which Item has the most allure?
                item A     item B
        User    |  bid  ||   Bid
        0       |   10  ||   25
        1       |   10  ||   25
        2       |   15  ||  None
        3       |   15  ||  None

        Current metric treats them as equivalent, although a given auction
        result for each item has different effects on regret, fulfillment etc.
        '''
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
    # TODO: handle situations when they result in deadlock or ties.

    def bb_selector(self, item):
        '''Best-bid selector:
        Item is awarded to the agent with the highest bid. This is the
        traditional auction model.
        '''
        assert item in self.bid_table
        return max(((a, b) for a, b in self.bid_table[item].iteritems()),
                key=lambda x: x[1])[0]

    def lmbb_selector(self, item, ZETA=0.2):
        '''Loss-Modified Best Bid Selector:
        Item is awarded to the agent with the highest loss-modified bid (LMB)
        LMB = bid + loss(Agent) * ZETA

        This method biases decisions towards agents who have lost a lot
        '''
        assert item in self.bid_table
        lm_bids = self.lmb_table(item, ZETA)
        return max(lm_bids, key=lambda x: x[1])[0]

    def mf_selector(self, item):
        '''Marginal fulfillment selector:
        Item is awarded to the agent who would have the most relative
        fulfillment. This biases decisions towards agents who have not
        been awarded much.
        '''

        assert item in self.bid_table
        Fs = []
        for p in self.bid_table[item].iterkeys():
            f0 = self.fulfillment(p)
            f1 = f0 + self.bid_table[item][p]
            Fs.append((p, float(f0) / f1))
        return min(Fs, key=lambda x: x[1])[0]

    def mr_selector(self, item):
        '''Marginal Regret selector:
        Item is awarded to and agent such that the marginal regret is
        minimised.

        Biases decisions in favor of 'not rocking the boat', in the hopes
        that it reduces envy.
        '''
        marginals = self.marginal_regret_table(item)
        return min(marginals, key=lambda x: x[1])[0]

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

    def resolve(self, **kwargs):
        '''Resolve the auction. After the initial allocation of uncontested
        items, items are awarded in order of descending rank values.
        i.e. map(rank, items).sort(reverse=True)'''

        # TODO: Arbiter function is not necessary if we only use one decision
        #       engine
        rank = self.allure
        arbiter = None
        if 'rank' in kwargs:
            rank = kwargs['rank']
        if 'arbiter' in kwargs:
            arbiter = kwargs['arbiter']

        self.resolve_uncontested()
        allocations = []
        remaining_items = [k for k in self.bid_table
                             if self.allocs[k] is None]
        remaining_items.sort(key=rank)

        while len(remaining_items) > 0:
            item = remaining_items.pop()
            # loss modifier method
            lmbb_victor = self.lmbb_selector(item)
            self.allocs[item] = lmbb_victor
            allocations.append((item, lmbb_victor))

        self.complete = True
        return allocations


if __name__ == '__main__':
    main()
