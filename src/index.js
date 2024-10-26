/**
 * Gefið efni fyrir verkefni 9, ekki er krafa að nota nákvæmlega þetta en nota
 * verður gefnar staðsetningar.
 */

import { el, empty } from './lib/elements.js';
import { weatherSearch } from './lib/weather.js';

/**
 * @typedef {Object} SearchLocation
 * @property {string} title
 * @property {number} lat
 * @property {number} lng
 */

/**
 * Allar staðsetning sem hægt er að fá veður fyrir.
 * @type Array<SearchLocation>
 */
const locations = [
  {
    title: 'Reykjavík',
    lat: 64.1355,
    lng: -21.8954,
  },
  {
    title: 'Akureyri',
    lat: 65.6835,
    lng: -18.0878,
  },
  {
    title: 'New York',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    title: 'Tokyo',
    lat: 35.6764,
    lng: 139.65,
  },
  {
    title: 'Sydney',
    lat: 33.8688,
    lng: 151.2093,
  },
];

/**
 * Hreinsar fyrri niðurstöður, passar að niðurstöður séu birtar og birtir element.
 * @param {Element} element
 */
function renderIntoResultsContent(element) {
  // TODO útfæra
  const resultsContainer = document.getElementById('resultsSection');
  console.log('appending',resultsContainer);
  empty(resultsContainer);
  resultsContainer.appendChild(element);
  resultsContainer.classList.remove('hidden');
}

/**
 * Birtir niðurstöður í viðmóti.
 * @param {SearchLocation} location
 * @param {Array<import('./lib/weather.js').Forecast>} results
 */
function renderResults(location, results) {
  const resContainer = el('div',{class:'results'});
  const titel = el('h2',{},`Veður fyrir ${location.title}`);
  const tabelEle = el('table',{class:'forecast'});
  const headEle = el('thead',{}, el('tr',{}, el('th',{},'Klukkutími'),el('th',{},'Hitastig (C)'),el('th',{},'Úrkoma (mm)')));
  tabelEle.appendChild(headEle);
  const body = el('tbody',{});
  for(let i = 0; i < results.hourly.time.length;i++){
    const times = results.hourly.time[i].split('T')[1];
    const temp = results.hourly.temperature_2m[i];
    const precip = results.hourly.precipitation[i];

    console.log(precip);
    
    const radir = el('tr',{}, el('td' ,{},times),el('td',{},temp),el('td',{},precip));
    body.appendChild(radir);
  }
  tabelEle.appendChild(body);
  resContainer.appendChild(titel);
  resContainer.appendChild(tabelEle);
  console.log("container created",resContainer);
  renderIntoResultsContent(resContainer);
}

/**
 * Birta villu í viðmóti.
 * @param {Error} error
 */
function renderError(error) {
  const msg = el('p',{class:'error'},`Error ${error.message}`);
  renderIntoResultsContent(msg);
  // TODO útfæra
}

/**
 * Birta biðstöðu í viðmóti.
 */
function renderLoading() {
  const msg = el('div',{class:'loading'},'leita...');
  renderIntoResultsContent(msg);

  // TODO útfæra
}

/**
 * Framkvæmir leit að veðri fyrir gefna staðsetningu.
 * Birtir biðstöðu, villu eða niðurstöður í viðmóti.
 * @param {SearchLocation} location Staðsetning sem á að leita eftir.
 */
async function onSearch(location) {
  console.log('onSearch', location);
  renderLoading();
  try {
    const results = await weatherSearch(location.lat, location.lng);
    console.log(results);
    renderResults(location, results);
  } catch (error) {
    renderError(error);
  }

  // Birta loading state
  // TODO útfæra
  // Hér ætti að birta og taka tillit til mismunandi staða meðan leitað er.
}

/**
 * Framkvæmir leit að veðri fyrir núverandi staðsetningu.
 * Biður notanda um leyfi gegnum vafra.
 */
async function onSearchMyLocation() {
  // TODO útfæra
}

/**
 * Býr til takka fyrir staðsetningu.
 * @param {string} locationTitle
 * @param {() => void} onSearch
 * @returns {HTMLElement}
 */
function renderLocationButton(locationTitle, onSearch) {
  // Notum `el` fallið til að búa til element og spara okkur nokkur skref.
  const locationElement = el(
    'li',
    { class: 'locations__location' },
    el(
      'button',
      { class: 'locations__button', click: onSearch },
      locationTitle,
    ),
  );

  /* Til smanburðar við el fallið ef við myndum nota DOM aðgerðir
  const locationElement = document.createElement('li');
  locationElement.classList.add('locations__location');
  const locationButton = document.createElement('button');
  locationButton.appendChild(document.createTextNode(locationTitle));
  locationButton.addEventListener('click', onSearch);
  locationElement.appendChild(locationButton);
  */

  return locationElement;
}

/**
 * Býr til grunnviðmót: haus og lýsingu, lista af staðsetningum og niðurstöður (falið í byrjun).
 * @param {Element} container HTML element sem inniheldur allt.
 * @param {Array<SearchLocation>} locations Staðsetningar sem hægt er að fá veður fyrir.
 * @param {(location: SearchLocation) => void} onSearch
 * @param {() => void} onSearchMyLocation
 */
function render(container, locations, onSearch, onSearchMyLocation) {
  // Búum til <main> og setjum `weather` class
  const parentElement = document.createElement('main');
  parentElement.classList.add('weather');

  // Búum til <header> með beinum DOM aðgerðum
  const headerElement = document.createElement('header');
  const heading = document.createElement('h1');
  const paragraph = document.createElement('p');
  paragraph.appendChild(document.createTextNode('Veldu stað til að sjá hita - og úrkomuspá'));
  heading.appendChild(document.createTextNode('Veðrið'));
  const place = document.createElement('h2');
  place.appendChild(document.createTextNode('Staðsetningar'));
  headerElement.appendChild(heading);
  headerElement.appendChild(paragraph);
  headerElement.appendChild(place);
  parentElement.appendChild(headerElement);

  // TODO útfæra inngangstexta
  // Búa til <div class="loctions">
  const locationsElement = document.createElement('div');
  locationsElement.classList.add('locations');

  // Búa til <ul class="locations__list">
  const locationsListElement = document.createElement('ul');
  locationsListElement.classList.add('locations__list');

  // <div class="loctions"><ul class="locations__list"></ul></div>
  locationsElement.appendChild(locationsListElement);
  const myLocation = el('button',{class: 'locations_button', click: onSearchMyLocation},'My Location');
  locationsElement.appendChild(myLocation);

  // <div class="loctions"><ul class="locations__list"><li><li><li></ul></div>
  for (const location of locations) {
    const liButtonElement = renderLocationButton(location.title, () => onSearch(location));
    locationsListElement.appendChild(liButtonElement);
  }

  parentElement.appendChild(locationsElement);

  // TODO útfæra niðurstöðu element

  const eleContainer = el('div',{id: 'resultsSection',class: 'results hidden'});
  parentElement.appendChild(eleContainer);

  container.appendChild(parentElement);
}

// Þetta fall býr til grunnviðmót og setur það í `document.body`
render(document.body, locations, onSearch, onSearchMyLocation);
