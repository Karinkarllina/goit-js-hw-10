import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries }  from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchBoxEl.addEventListener('input', debounce(inputSearch, DEBOUNCE_DELAY));


function inputSearch(event) {
    event.preventDefault();
    const inputValueSearch = event.target.value.trim();

fetchCountries(inputValueSearch) 
    .then(data => {
        if (data.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.')
            return;
        }
        showResult(data) 
    })

    .catch(error => {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHeight = '';
        Notify.failure('Oops, there is no country with that name!')
        })

}

function showResult(data) {
    const inputLength = data.length;

    if (inputLength === 1) {
        countryCardMarkup(data)
        countryListEl.innerHTML = '';
        countryInfoEl.innerHeight = '';
    }

    if (inputLength > 1 && inputLength <= 10) {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHeight = '';
        createCountriesMarkup(data)
    }
}






// РОЗМІТКА!

function countryCardMarkup(data) {
        const cardMarkup = data.map(({ flags, name, capital, population, languages }) => {
            return `<img src="${flags.svg}" alt="${name}" width="320" height="auto">
                <p> ${name.official}</p>
                <p>Capital: <span> ${capital}</span></p>
                <p>Population: <span> ${population}</span></p>
                <p>Languages: <span> ${languages}</span></p>`;
        }).join('');
        countryInfoEl.innerHTML = cardMarkup;
        return cardMarkup;
}

function createCountriesMarkup(data) {
    const countriesMarkup = data.map((({ name, flags }) => {
        return `<li>
                     <img src="${flags.svg}" alt="${name}" width="70" height="auto">
                     <span>${name.official}</span>
                </li>`;
    })).join('');
    countryListEl.innerHTML = countriesMarkup;
    return countriesMarkup;

}
