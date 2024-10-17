import { render } from './framework/render.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import NewTripInfoView from './view/new-trip-info-view.js';
import NewTripFiltersView from './view/new-filters-view.js';
import BoardPresenter from './presenter/board-presenter.js';

const filters = [
  {
    type: 'all',
    count: 0,
  },
];

const tripMainContainer = document.querySelector('.trip-main');
const tripFiltersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  eventsModel
});


render (new NewTripInfoView(), tripMainContainer, 'AFTERBEGIN');
render(new NewTripFiltersView({
  filters,
  currentFilterType: 'all',
  onFilterTypeChange: () => {}
}), tripFiltersContainer);


boardPresenter.init();

