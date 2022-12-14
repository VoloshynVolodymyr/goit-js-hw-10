import './css/styles.css';
import lodash from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './JS/fetchCountries';
Notify.init({
  width: '480px',
  position: 'center-center',
  distance: '100px',
  cssAnimationDuration: 2000,
  opacity: 1,
  fontSize: '24px',
});
const DEBOUNCE_DELAY = 1000;

const inputData = document.querySelector('#search-box');
const countryMarkup = document.querySelector('.country-list');
inputData.addEventListener('input', lodash(onInput, DEBOUNCE_DELAY));
let arrayCountries = [];

function onInput() {
  if (inputData.value.trim() === '') {
    countryMarkup.innerHTML = '';
    inputData.value = '';
    return;
  }

  function showMarkup(array) {
    countryMarkup.insertAdjacentHTML('beforeend', checkCountOfCountries(array));
  }

  countryMarkup.innerHTML = '';
  fetchCountries(inputData.value.trim())
    .then(countries => {
      arrayCountries = [...countries];
      showMarkup(arrayCountries);

      countryMarkup.addEventListener('click', clickOnFlag);
      function clickOnFlag(e) {
        if (e.target.classList.contains('flag')) {
          countryMarkup.innerHTML = '';
          const resultArray = arrayCountries.filter(
            ev => e.target.name === ev.capital
          );
          showMarkup(resultArray);
          Notify.info(`press ESC to exit`)
         }
      }
      document.addEventListener("keydown", event => {
        if (event.code === "Escape") {
          countryMarkup.innerHTML = '';
          showMarkup(arrayCountries);
        }})
    })
    .catch(error => Notify.failure(`Oops, there is no country with that name`));
}

function createMarkupManyCountries(array) {
  let str = '';
  array.map(elem => {
    str =
      str +
      `<li>
        <img class="flag" name=${elem.capital} src="${elem.flags.svg}" alt="Flag of ${elem.name}" width=90 height=60>
        <span>${elem.name}</span>
   </li>`;
  });
  return str;
}

function createMarkupOneCountry(elem) {
  return `<img 
                src="${elem.flags.svg}" 
                alt="Flag of ${elem.name}"
                width=780>
        <p>${elem.name}</p>
        <p>Capital: ${elem.capital}</p>
        <p>Population: ${elem.population}</p>
        <p>Languages:
        ${elem.languages.map(e => e.name).join(', ')}</p>
        `;
}

function checkCountOfCountries(array) {
  if (array.length > 10) {
    Notify.info(`Too many matches found. Please enter a more specific name.`);
    return '';
  } else if (array.length > 1) return createMarkupManyCountries(array);
  else return createMarkupOneCountry(array[0]);
}
