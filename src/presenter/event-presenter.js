import { render, replace } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';

export default class EventPresenter {
  #container = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #eventItem = null;

  constructor ({container}) {
    this.#container = container;
  }

  init (eventItem) {
    this.#eventItem = eventItem;

    this.#eventComponent = new NewEventsItemView({
      userEvent: this.#eventItem,
      onClick: this.#handleEditClick,
    });
    this.#eventEditComponent = new NewEventEditElementView({
      userEvent: this.#eventItem,
      onClick: this.#handleSaveClick,
    });

    render(this.#eventComponent, this.#container);
  }

  #replaceEventCardToEditForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditFormToEventCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceEditFormToEventCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceEventCardToEditForm();
  };

  #handleSaveClick = () => {
    this.#replaceEditFormToEventCard();
  };

}
