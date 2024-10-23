import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const.js';

const NoEventsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoEventsViewTemplate = (filterType, isLoadingDataError) => {
  let noEventTextValue = NoEventsTextType[filterType];
  if (isLoadingDataError) {
    noEventTextValue = 'Failed to load latest route information';
  }

  return `<p class="trip-events__msg">${noEventTextValue}</p>`;
};

export default class NoEventsView extends AbstractView {
  #filterType = null;
  #isLoadingDataError = false;

  constructor({filterType, isLoadingDataError}) {
    super();
    this.#filterType = filterType;
    this.#isLoadingDataError = isLoadingDataError;
  }

  get template () {
    return createNoEventsViewTemplate(this.#filterType, this.#isLoadingDataError);
  }
}
