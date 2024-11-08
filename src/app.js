import "/styles.css";

let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// Display cid in Money Inventory
function displayCid() {
  cid.forEach(([denomination, amount]) => {
    const element = document.getElementById(denomination.toLowerCase());
    if (element) {
      element.textContent = `${denomination}: $${amount.toFixed(2)}`;
    }
  });
}

// Call displayCid initially to populate the inventory
displayCid();

document.getElementById("purchase-btn").addEventListener("click", function() {
  let cash = parseFloat(document.getElementById("cash").value);
  let changeDue = document.getElementById("change-due");
  let amountDue = document.getElementById("amount-due");

  if (isNaN(cash)) {
    amountDue.textContent = "Please enter a valid cash amount.";
    return;
  }

  const amountDifference = cash - price;

  if (cash < price) {
    amountDue.textContent = `Please pay an additional $${price - cash}`;
    alert("Customer does not have enough money to purchase the item");
    changeDue.textContent = "";
  } else if (cash === price) {
    amountDue.textContent = `Amount Due: $${amountDifference}`;
    changeDue.textContent = "No change due - customer paid with exact cash";
  } else {
    amountDue.textContent = `Amount Due: $${amountDifference}`;
    const change = cash - price;
    const changeArray = calculateChange(change);

    if (changeArray.status === "INSUFFICIENT_FUNDS") {
      changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    } else if (changeArray.status === "CLOSED") {
      changeDue.textContent = `Status: CLOSED ${formatChange(
        changeArray.change
      )}`;
    } else {
      changeDue.textContent = `Status: OPEN ${formatChange(
        changeArray.change
      )}`;
    }
  }
});

function calculateChange(change) {
  let changeArr = [];
  let totalCid = cid.reduce((acc, curr) => acc + curr[1], 0);

  if (totalCid === change) {
    return { status: "CLOSED", change: cid };
  } else if (totalCid < change) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  const currencyUnit = {
    PENNY: 0.01,
    NICKEL: 0.05,
    DIME: 0.1,
    QUARTER: 0.25,
    ONE: 1,
    FIVE: 5,
    TEN: 10,
    TWENTY: 20,
    "ONE HUNDRED": 100
  };

  for (let i = cid.length - 1; i >= 0; i--) {
    let [coinName, coinTotal] = cid[i];
    let coinValue = currencyUnit[coinName];
    let amount = 0;

    while (change >= coinValue && coinTotal > 0) {
      change = parseFloat((change - coinValue).toFixed(2));
      coinTotal -= coinValue;
      amount += coinValue;
    }

    if (amount > 0) {
      changeArr.push([coinName, amount]);
      cid[i][1] = parseFloat(coinTotal.toFixed(2)); // Update cid to reflect new amount
    }
  }

  if (change > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  return { status: "OPEN", change: changeArr };
}

function formatChange(changeArr) {
  return changeArr.map(coin => `${coin[0]}: $${coin[1].toFixed(2)}`).join(" ");
}

// Additional feature: Handle adding cash to drawer
function addToCid(cashAmount) {
  let remainingAmount = cashAmount;

  for (let i = cid.length - 1; i >= 0 && remainingAmount > 0; i--) {
    let [denomination, amount] = cid[i];
    let denominationValue = currencyUnit[denomination];
    console.log(denominationValue);
    while (remainingAmount >= denominationValue) {
      remainingAmount -= denominationValue;
      cid[i][1] += denominationValue;
      displayCid();
    }
  }
}
