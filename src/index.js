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

    if (inputValueSearch === '') {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
    }
    

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
        countryInfoEl.innerHTML= '';
        Notify.failure('Oops, there is no country with that name!')
        })

}

function showResult(data) {
    const inputLength = data.length;

    if (inputLength === 1) {
        countryCardMarkup(data)
        countryListEl.innerHTML = '';
        
    }

    if (inputLength >= 2 && inputLength <= 10) {
        countryInfoEl.innerHTML = '';
        createCountriesMarkup(data)
    }
}

// РОЗМІТКА!

function countryCardMarkup(data) {
    const cardMarkup = data.map(({ flags, name, capital, population, languages }) => {
        languages = Object.values(languages).join(", ");
            return ` 
                <div class = "country-cover">
                    <img src="${flags.svg}" alt="${name}" width="50" height="50">
                    <p class = "country-name"> ${name.official}</p>
                </div>
                <ul>
                    <li><p class = "country-options">Capital: <span class = "country-description"> ${capital}</span></p></li>
                    <li><p class = "country-options">Population: <span class = "country-description"> ${population}</span></p></li>
                    <li><p class = "country-options">Languages: <span class = "country-description"> ${languages}</span></p></li>
                </ul>`;
        }).join('');
        countryInfoEl.innerHTML = cardMarkup;
        return cardMarkup;
}

function createCountriesMarkup(data) {
    const countriesMarkup = data.map((({ name, flags }) => {
        return `<li class = "countries-wrap">
                     <img src="${flags.svg}" class = "country-img" alt="${name}" width="30" height="30">
                     <p class = "country-name">${name.official}</p>
                </li>`;
    })).join('');
    countryListEl.innerHTML = countriesMarkup;
    return countriesMarkup;

}
