import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { EVENTS_TYPES } from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


const createNewOffer = (id, offer) => {
  const { title, price, isActive } = offer;
  return `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-luggage" ${isActive ? 'checked' : ''}>
                        <label class="event__offer-label" for="event-offer-${id}" data-offer-id="${id}">
                          <span class="event__offer-title">${title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${price}</span>
                        </label>
                      </div>`;
};

const createOffers = (offersMap) => {
  let offersHTML = '';
  offersMap.forEach((offer, id) => {
    offersHTML += createNewOffer(id, offer);
  });
  return offersHTML;
};

const createOffersContainer = (offersMap) => {
  if (!offersMap.size > 0) {
    return '';
  }
  return `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${createOffers(offersMap)}
                    </div>
                  </section>`;
};

const createType = (type) => {
  const typeToLowerCase = type.toLowerCase();
  return `<div class="event__type-item">
                          <input id="event-type-${typeToLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeToLowerCase}">
                          <label class="event__type-label  event__type-label--${typeToLowerCase}" for="event-type-${typeToLowerCase}-1" data-event-type="${typeToLowerCase}" >${type}</label>
                        </div>`;
};

const createTypes = (types) => {
  let typesHTML = '';
  types.forEach((type) => {
    typesHTML += createType(type);
  });
  return typesHTML;
};

const createDestination = (destination) => `<option data-destination-id="${destination.id}" value="${destination.name}">${destination.name}</option>`;

const createDestinations = (destinationsList) => {
  if (!Array.isArray(destinationsList)) {
    return;
  }

  let destinationsHTML = '';
  destinationsList.forEach((destination) => {
    destinationsHTML += createDestination(destination);
  });
  return destinationsHTML;
};

const createDestinationDescription = (description) => {
  if (!description) {
    return '';
  }
  return `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                  </section>`;
};

const createOpenEventButton = (isDefaultEvent) => {
  if (isDefaultEvent) {
    return '';
  }
  return `<button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`;
};

const createNewEventEditElementTemplate = (eventData, destinationsList, isDefaultEvent) => {
  const {basePrice, type, offers, destination, dateFrom, dateTo} = eventData;

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createTypes(EVENTS_TYPES)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="${destination.id === undefined ? '' : destination.id}" type="text" name="event-destination" value="${destination.name === undefined ? '' : destination.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                    ${createDestinations(destinationsList)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  ${createOpenEventButton(isDefaultEvent)}
                </header>
                <section class="event__details">
                    ${createOffersContainer(offers)}
                    ${createDestinationDescription(destination.description)}
                </section>
              </form>
            </li>`;
};

export default class NewEventEditElementView extends AbstractStatefulView {
  #eventData = null;
  #handleClick = null;
  #handleDeleteClick = null;
  #rollupButton = null;
  #destinationsData = null;
  #findDestinationData = null;
  #getOffersMapByType = null;
  #datepicker = null;
  #isDefaultEvent = null;

  #handleSubmit = null;
  #formElement = null;

  constructor ({userEvent, onClick, onSubmit, onDeleteClick, findDestinationData, destinationsData, getOffersMapByType, isDefaultEvent}) {
    super();
    this.#eventData = userEvent;
    this.#findDestinationData = findDestinationData;
    this.#destinationsData = destinationsData;
    this.#getOffersMapByType = getOffersMapByType;
    this.#isDefaultEvent = isDefaultEvent;
    this._setState(NewEventEditElementView.parseEventDataToState(userEvent));

    this.#handleClick = onClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleSubmit = onSubmit;

    this._restoreHandlers();

  }

  get template () {
    return createNewEventEditElementTemplate(this._state, this.#destinationsData, this.#isDefaultEvent);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset (eventData) {
    this.updateElement(
      NewEventEditElementView.parseEventDataToState(eventData),
    );
  }

  _restoreHandlers() {
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#formElement = this.element.querySelector('.event--edit');
    this.#formElement.addEventListener('submit', this.#submitHandler);
    if (!this.#isDefaultEvent) {
      this.#rollupButton.addEventListener('click', this.#clickHandler);
    }

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteHandler);

    this.element.querySelector('#event-price-1')
      .addEventListener('input', this.#eventPriceToggleHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#eventDestinationToggleHandler);

    this.element.querySelectorAll('.event__type-label')
      .forEach((label) => {
        label.addEventListener('click', this.#eventTypeToggleHandler);
      });
    this.element.querySelectorAll('.event__offer-label')
      .forEach((label) => {
        label.addEventListener('click', this.#eventOfferToggleHandler);
      });

    this.#setDatepicker();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick(this.#eventData);
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(NewEventEditElementView.parseStateToEventData(this._state));
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(NewEventEditElementView.parseStateToEventData(this._state));
  };

  removeEventListeners() {
    this.#rollupButton.removeEventListener('click', this.#clickHandler);
    this.#formElement.removeEventListener('submit', this.#submitHandler);
  }

  #setDatepicker() {
    const timeInputs = this.element.querySelectorAll('.event__input--time');
    this.datepickers = [];

    timeInputs.forEach((input, index) => {
      const date = index ? this._state.dateTo : this._state.dateFrom;
      const options = {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: date,
        onChange: (selectedDates) => this.#eventStartTimeToggleHandler(selectedDates, index),
      };

      const datepickerInstance = flatpickr(input, options);
      this.datepickers[index] = datepickerInstance;

      this.#updateDatePickerConstraints(index);
    });
  }

  #eventStartTimeToggleHandler = ([userDate], index) => {
    this.updateElement({
      [index ? 'dateTo' : 'dateFrom']: userDate,
    });
    this.#updateDatePickerConstraints(index);
  };

  #updateDatePickerConstraints(index) {
    const minDate = this._state.dateFrom;
    const maxDate = this._state.dateTo;

    if (index) {
      this.datepickers[index].set('minDate', minDate);
    } else {
      this.datepickers[index].set('maxDate', maxDate);
    }
  }

  static parseEventDataToState(eventData) {
    return eventData;
  }

  static parseStateToEventData(state) {
    return state;
  }

  #eventPriceToggleHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #eventDestinationToggleHandler = (evt) => {
    const inputValue = evt.target.value;
    const options = document.querySelectorAll('#destination-list-1 option');

    options.forEach((option) => {
      if (option.value === inputValue) {
        const cityId = option.getAttribute('data-destination-id');

        const selectedDestination = this.#findDestinationData(cityId);

        if (selectedDestination) {
          this.updateElement({
            destination: selectedDestination,
          });
        }
      }
    });
  };

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.dataset.eventType,
      offers: this.#getOffersMapByType(evt.target.dataset.eventType),
    });
  };

  #eventOfferToggleHandler = (evt) => {
    evt.preventDefault();

    const offerId = evt.currentTarget.dataset.offerId;
    const offers = this._state.offers;

    if (offers.has(offerId)) {
      const offer = offers.get(offerId);
      offer.isActive = !offer.isActive;
      offers.set(offerId, offer);

      this.updateElement({
        offers: offers,
      });
    }
  };

}
