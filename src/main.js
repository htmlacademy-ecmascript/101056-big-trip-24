import { render } from './framework/render.js';
import EventsModel from './model/events-model.js';
import NewTripInfoView from './view/new-trip-info-view.js';
import NewTripFiltersView from './view/new-filters-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { generateFilter } from './mock/filter.js';


const tripMainContainer = document.querySelector('.trip-main');
const tripFiltersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  eventsModel
});

const filters = generateFilter(eventsModel.userEvents);

render (new NewTripInfoView(), tripMainContainer, 'AFTERBEGIN');
render (new NewTripFiltersView({filters}), tripFiltersContainer);


boardPresenter.init();

