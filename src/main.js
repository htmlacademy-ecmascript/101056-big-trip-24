import NewTripInfoView from './view/new-trip-info-view.js';
import {render} from './render.js';

const tripMainElement = document.querySelector('.trip-main');

render (new NewTripInfoView(), tripMainElement, 'AFTERBEGIN');
