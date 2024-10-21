import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';
import { UserAction, UpdateType } from '../const.js';
import {isEventFuture, isEventPresent, isEventPast, isDatesEqual} from '../utils/event.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #container = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #findDestinationData = null;
  #destinationsData = null;
  #getOffersMapByType = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #eventItem = null;
  #mode = Mode.DEFAULT;

  constructor ({container, onDataChange, onModeChange, findDestinationData, getOffersMapByType}) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#findDestinationData = findDestinationData;
    this.#getOffersMapByType = getOffersMapByType;
  }

  init (eventItem, destinationsData) {
    this.#eventItem = eventItem;
    this.#destinationsData = destinationsData;
    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new NewEventsItemView({
      userEvent: this.#eventItem,
      onClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#eventEditComponent = new NewEventEditElementView({
      userEvent: this.#eventItem,
      onClick: this.#handleOpenEventClick,
      onSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      findDestinationData: this.#findDestinationData,
      destinationsData: this.#destinationsData,
      getOffersMapByType: this.#getOffersMapByType,
      isDefaultEvent: this.isDefaultEvent,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace (this.#eventComponent, prevEventComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace (this.#eventEditComponent, prevEventEditComponent);
    }
    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  #replaceEventCardToEditForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToEventCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#eventItem);
      this.#replaceEditFormToEventCard();
    }
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

  #handleDeleteClick = (event) => {
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#eventItem, isFavorite: !this.#eventItem.isFavorite}
    );
  };

  #handleOpenEventClick = (eventItem) => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      eventItem,
    );
    this.#replaceEditFormToEventCard();
  };

  #handleFormSubmit = (update) => {

    const isMinorUpdate =
        !isDatesEqual(this.#eventItem.dateFrom, update.dateFrom) ||
        !isDatesEqual(this.#eventItem.dateTo, update.dateTo) ||
        isEventFuture(update.dateFrom) !== isEventFuture(this.#eventItem.dateFrom) ||
        isEventPresent(update.dateFrom, update.dateTo) !== isEventPresent(this.#eventItem.dateFrom, this.#eventItem.dateTo) ||
        isEventPast(update.dateTo) !== isEventPast(this.#eventItem.dateTo);

    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceEditFormToEventCard();
  };

}
