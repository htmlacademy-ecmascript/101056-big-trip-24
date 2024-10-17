import { render } from './framework/render.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import NewTripInfoView from './view/new-trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';


const tripMainContainer = document.querySelector('.trip-main');
const tripFiltersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  eventsModel
});
const filterPresenter = new FilterPresenter({
  filterContainer: tripFiltersContainer,
  filterModel,
  eventsModel
});


render (new NewTripInfoView(), tripMainContainer, 'AFTERBEGIN');

filterPresenter.init();
boardPresenter.init();

