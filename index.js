

function getElement(selection) {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  }
  throw new Error(
    `Please check "${selection}" selector, no such element exists`
  );
}

const curr = getElement(".default").value;
const rates = getElement("#rates");
const body = getElement("body");
const container = getElement(".container");
const rateContainer = getElement(".rate-container");
const selectAll = container.querySelectorAll("option");
const lengthSpan1 = rateContainer.querySelector(".length1");
const lengthSpan2 = rateContainer.querySelector(".length2");
const lengthSpan3 = rateContainer.querySelector(".length3");
const group1 = rateContainer.querySelector(".gr1");
const group2 = rateContainer.querySelector(".gr2");
const group3 = rateContainer.querySelector(".gr3");
const longestLength = rateContainer.querySelector(".length-longest");
const longest = rateContainer.querySelector(".longest");
const form = container.querySelector("form");

let arr1 = [];
let arr2 = [];
let arr3 = [];
let longestArr = [];

// conditions and rendering the first 3 groups
const renderData = (def, cur, rate) => {
  if (cur === rates.value) return;
  if (rate < 1) {
    arr1.push(rate);
    const html = `
    <div>
    <span class="currency">${def.toUpperCase()} to ${cur.toUpperCase()}</span>
    <span class="rate">${rate.toFixed(2)}</span>
    </div>
    `;
    group1.insertAdjacentHTML("beforeend", html);
  }
  if (rate >= 1 && rate < 1.5) {
    arr2.push(rate);
    const html = `
    <div>
        <span class="currency">${def.toUpperCase()} to ${cur.toUpperCase()}</span>
        <span class="rate">${rate.toFixed(2)}</span>
    </div>
  `;
    group2.insertAdjacentHTML("beforeend", html);
  }
  if (rate >= 1.5) {
    arr3.push(rate);
    const html = `
    <div>
    <span class="currency">${def.toUpperCase()} to ${cur.toUpperCase()}</span>
    <span class="rate">${rate.toFixed(2)}</span>
  </div>
  `;
    group3.insertAdjacentHTML("beforeend", html);
  }
  lengthSpan1.textContent = `Count:${arr1.length}`;
  lengthSpan2.textContent = `Count:${arr2.length}`;
  lengthSpan3.textContent = `Count:${arr3.length}`;
};

// functionality for group 4
const renderLongest = (def, cur, firstRate, secondRate) => {

  if (def === cur) return;

  longestArr.push(firstRate);
  longestArr.push(secondRate);

  const html = `
   <div>
      <span class="currency">${def.toUpperCase()} to ${cur.toUpperCase()}</span>
      <span class="rate">${firstRate.toFixed(2)}</span>
    </div>
    <div>
      <span class="currency">${cur.toUpperCase()} to ${def.toUpperCase()}</span>
      <span class="rate">${secondRate.toFixed(2)}</span>
    </div>
`;
  longest.insertAdjacentHTML("beforeend", html);
  longestLength.textContent = `Count:${longestArr.length}`;
};

const loadDefaultCurrency = async (currency, numOfCurrency) => {

  arr1 = [];
  arr2 = [];
  arr3 = [];
  longestArr = [];

  longestLength.textContent = `Count:${0}`;

  group1.innerHTML = "";
  group2.innerHTML = "";
  group3.innerHTML = "";
  longest.innerHTML = "";

  // currency rendering functionality

  for (let i = 0; i < numOfCurrency.length; i++) {
    try {
      const res = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}/${numOfCurrency[i].value}.json`
      );

      const opposite = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${numOfCurrency[i].value}/${currency}.json`
      );
      const data = await res.json();
      const oppositeData = await opposite.json();

      if (!res.ok || !opposite.ok) {
        throw new Error('Something went wrong!');
      }
      // group 4 rendering & longest array
      data[numOfCurrency[i].value] - oppositeData.usd <= 0.5 &&
        renderLongest(
          currency,
          numOfCurrency[i].value,
          data[numOfCurrency[i].value],
          oppositeData.usd
        );

      // rendering of group 1 ,group 2 and group 3
      renderData(
        currency,
        numOfCurrency[i].value,
        data[numOfCurrency[i].value]
      );
    } catch (err) {
      console.log(err);
    }
  }
};

window.addEventListener("DOMContentLoaded", function () {
  return loadDefaultCurrency(rates.value, selectAll);
});

rates.addEventListener("change", function () {
  return loadDefaultCurrency(rates.value, selectAll);
});
