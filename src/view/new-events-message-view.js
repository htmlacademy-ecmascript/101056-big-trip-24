import AbstractView from '../framework/view/abstract-view';

function createNewEventsMessageTemplate() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class NewEventsMessageView extends AbstractView {
  get template () {
    return createNewEventsMessageTemplate();
  }
}
