import { render } from './framework/render.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import NewTripInfoView from './view/new-trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewAddEventButtonView from './view/new-add-event-button-view.js';
import EventsApiService from './events-api-service.js';

const AUTHORIZATION = 'Basic 357082111.1703690932';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';


const tripMainContainer = document.querySelector('.trip-main');
const tripFiltersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const eventsModel = new EventsModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  eventsModel,
  filterModel,
  onNewEventDestroy: handleNewEventFormClose,
});
const filterPresenter = new FilterPresenter({
  filterContainer: tripFiltersContainer,
  filterModel,
  eventsModel
});

const newEventButtonComponent = new NewAddEventButtonView({
  onClick: handleNewEventButtonClick
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  boardPresenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}


render (new NewTripInfoView(), tripMainContainer, 'AFTERBEGIN');
render(newEventButtonComponent, tripMainContainer);


filterPresenter.init();
boardPresenter.init();
eventsModel.init();
