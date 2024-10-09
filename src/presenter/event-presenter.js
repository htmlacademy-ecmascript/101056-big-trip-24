import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';

export default class EventPresenter {
  #container = null;
  #handleDataChange = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #eventItem = null;

  constructor ({container, onDataChange}) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
  }

  init (eventItem) {
    this.#eventItem = eventItem;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new NewEventsItemView({
      userEvent: this.#eventItem,
      onClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#eventEditComponent = new NewEventEditElementView({
      userEvent: this.#eventItem,
      onClick: this.#handleSaveClick,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevEventComponent.element)) {
      replace (this.#eventComponent, prevEventComponent);
    }
    if (this.#container.contains(prevEventEditComponent.element)) {
      replace (this.#eventEditComponent, prevEventEditComponent);
    }
    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  #replaceEventCardToEditForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditFormToEventCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
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

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#eventItem, isFavorite: !this.#eventItem.isFavorite});
  };

  #handleSaveClick = (eventItem) => {
    this.#handleDataChange(eventItem);
    this.#replaceEditFormToEventCard();
  };

}
