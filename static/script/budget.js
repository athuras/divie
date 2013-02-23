var REM_BUDGET = 100;

function adjustBudget(amount)
{
	REM_BUDGET -= amount;
	var remBudget = document.getElementById("RemainingBudget");
	remBudget.innerHTML = "Remaining Budget " + REM_BUDGET;
};

function getRemainingBudget()
{
	return REM_BUDGET;
}

