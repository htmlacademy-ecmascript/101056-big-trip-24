import { remove, render, RenderPosition } from '../framework/render.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType } from '../const.js';

export default class NewEventPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #findDestinationData = null;
  #destinationsData = null;
  #getOffersMapByType = null;
  #userEvent = null;

  #eventEditComponent = null;

  constructor({eventListContainer, onDataChange, onDestroy, findDestinationData, destinationsData, getOffersMapByType, userEvent}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#findDestinationData = findDestinationData;
    this.#destinationsData = destinationsData;
    this.#getOffersMapByType = getOffersMapByType;
    this.#userEvent = userEvent;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new NewEventEditElementView({
      userEvent: this.#userEvent,
      onClick: this.#handleDeleteClick,
      onSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      findDestinationData: this.#findDestinationData,
      destinationsData: this.#destinationsData,
      getOffersMapByType: this.#getOffersMapByType,
      isDefaultEvent: true,
    });

    render(this.#eventEditComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (event) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      {id: nanoid(), ...event},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
