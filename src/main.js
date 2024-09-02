import {render} from './render.js';

import NewTripInfoView from './view/new-trip-info-view.js';
import NewTripFiltersView from './view/new-filters-view.js';
import BoardPresenter from './presenter/board-presenter.js';
// import NewEventsMessageView from './view/new-events-message-view.js';


const tripMainContainer = document.querySelector('.trip-main');
const tripFiltersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({container: tripEventsContainer});


render (new NewTripInfoView(), tripMainContainer, 'AFTERBEGIN');
render (new NewTripFiltersView(), tripFiltersContainer);
// render (new NewEventsMessageView(), tripEventsContainer);

boardPresenter.init();
