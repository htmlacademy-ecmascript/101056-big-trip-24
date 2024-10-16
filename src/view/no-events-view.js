import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const.js';

const NoTasksTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoEventsViewTemplate = (filterType) => {
  const noEventTextValue = NoTasksTextType[filterType];
  return `<p class="trip-events__msg">${noEventTextValue}</p>`;
};

export default class NoEventsView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template () {
    return createNoEventsViewTemplate(this.#filterType);
  }
}
