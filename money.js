const fromSelect = document.querySelector('[name="from_currency"]');
const toSelect = document.querySelector('[name="to_currency"]');
const fromInput = document.querySelector('[name="from_amount"]');
const toEl = document.querySelector('.to_amount');
const form = document.querySelector('.app form');

const endpoint = `https://api.exchangeratesapi.io/latest`;

//cache object, where we're going to store the rates that already asked for
const ratesByBase = {};

const currencies = {
	USD: 'United States Dollar',
	AUD: 'Australian Dollar',
	BGN: 'Bulgarian Lev',
	BRL: 'Brazilian Real',
	CAD: 'Canadian Dollar',
	CHF: 'Swiss Franc',
	CNY: 'Chinese Yuan',
	CZK: 'Czech Republic Koruna',
	DKK: 'Danish Krone',
	GBP: 'British Pound Sterling',
	HKD: 'Hong Kong Dollar',
	HRK: 'Croatian Kuna',
	HUF: 'Hungarian Forint',
	IDR: 'Indonesian Rupiah',
	ILS: 'Israeli New Sheqel',
	INR: 'Indian Rupee',
	JPY: 'Japanese Yen',
	KRW: 'South Korean Won',
	MXN: 'Mexican Peso',
	MYR: 'Malaysian Ringgit',
	NOK: 'Norwegian Krone',
	NZD: 'New Zealand Dollar',
	PHP: 'Philippine Peso',
	PLN: 'Polish Zloty',
	RON: 'Romanian Leu',
	RUB: 'Russian Ruble',
	SEK: 'Swedish Krona',
	SGD: 'Singapore Dollar',
	THB: 'Thai Baht',
	TRY: 'Turkish Lira',
	ZAR: 'South African Rand',
	EUR: 'Euro',
};

function generateOptions(options) {
  return Object.entries(options).map(([currencyCode, currrenyName]) => {
    // we destructure the array directly in the parametre definition
    // console.log(currencyCode, currrenyName);
    return `
      <option value="${currencyCode}">
        ${currencyCode} - ${currrenyName}
      </option>
    `;
  })
  .join('');
}

// default base parameter set to  USD
async function fetchRates(base = 'USD') {
  const res = await fetch(`${endpoint}?base=${base}`);
  const rates = await res.json();
  return rates;
  // console.log(rates);
}

async function convert(amount, from, to) {
  // check if we have the rates to convert from the that currency
  //  CACHE MISS
  if(!ratesByBase[from]) {
    console.log(`oh no we don't even have ${from} the rates to convert to ${to}. Let's get it`);
    const rates = await fetchRates(from);
    // store them for next time! if CAD, store them to
    ratesByBase[from] = rates;
  }
  // convert the amount that they passed in
  // CACHE HIT
  const rate = ratesByBase[from].rates[to];
  // console.log(rate);
  const convertedAmount = rate * amount;
  console.log(`${amount} ${from} is ${convertedAmount} in ${to}`);
  return convertedAmount;
};

const optionsHTML = generateOptions(currencies);
// console.log(optionsHTML);

//populate the option elements
fromSelect.innerHTML = optionsHTML;
toSelect.innerHTML = optionsHTML;

function formtatCurrency(amount, currency) {
  return Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amount);
}

 async function handleInput(e) {
  const rawAmount = await convert(
        fromInput.value,
        fromSelect.value,
        toSelect.value
        );
  // console.log(rawAmount);
  toEl.textContent = formtatCurrency(rawAmount, toSelect.value);
}

form.addEventListener('input', handleInput);
