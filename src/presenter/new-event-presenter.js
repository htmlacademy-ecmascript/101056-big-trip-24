import { remove, render, RenderPosition } from '../framework/render.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';
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

  constructor({eventListContainer, onDataChange, onDestroy, findDestinationData, getOffersMapByType}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#findDestinationData = findDestinationData;
    this.#getOffersMapByType = getOffersMapByType;
  }

  init(defaultEvent, destinationsData) {
    if (this.#eventEditComponent !== null) {
      return;
    }
    this.#userEvent = defaultEvent;
    this.#destinationsData = destinationsData;

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

  setSaving() {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
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

  setAborting() {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (event) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
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
