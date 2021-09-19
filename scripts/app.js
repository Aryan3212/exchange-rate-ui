const currencyOne = document.getElementById("currency-one");
const currencyTwo = document.getElementById("currency-two");
const amountOne = document.getElementById("amount-one");
const amountTwo = document.getElementById("amount-two");

const swapBtn = document.getElementById("swap");

const updateDataBtn = document.getElementById("updateData");

const rateElem = document.getElementById("rate");

// Fetch API if 24 hours have passed, save time in localStorage

function fetchExchangeRateData() {
  const currency_one = currencyOne.value;
  const currency_two = currencyTwo.value;

  const localData = JSON.parse(localStorage.getItem("exchange_rate_data"));
  // console.log(Date.now());
  // console.log(localData);
  if(localData===null ||  +localData.time_last_updated + 5000 > Date.now()){
  fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
    .then((res) => res.json())
    .then((data) => {
    //   console.log(data);
      localStorage.setItem("exchange_rate_data", JSON.stringify(data));
      const rate = data.rates[currency_two];

      rateElem.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

      amountTwo.value = (amountOne.value * rate).toFixed(2);
    });
}else{
    console.log("Network not called!");
    const rate = localData.rates[currency_two];

    rateElem.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

    amountTwo.value = (amountOne.value * rate).toFixed(2);
}
}

// Functions
function updateExchangeRate(){
    const currency_one = currencyOne.value;
  const currency_two = currencyTwo.value;
    fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
    .then((res) => res.json())
    .then((data) => {
        console.log("Force updated DATA");
      localStorage.setItem("exchange_rate_data", JSON.stringify(data));
      const rate = data.rates[currency_two];

      rateElem.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

      amountTwo.value = (amountOne.value * rate).toFixed(2);
    });
}

function calculateExchangeValue() {
  fetchExchangeRateData();
}

function swapExchangeRate() {
  let temp = currencyOne.value;
  currencyOne.value = currencyTwo.value;
  currencyTwo.value = temp;
  updateExchangeRate();
  calculateExchangeValue();
}



// Event Listeners
currencyOne.addEventListener("change", calculateExchangeValue);
currencyTwo.addEventListener("change", calculateExchangeValue);
amountOne.addEventListener("input", calculateExchangeValue);
amountTwo.addEventListener("input", calculateExchangeValue);

swapBtn.addEventListener("click", swapExchangeRate);
updateDataBtn.addEventListener("click", updateExchangeRate);
