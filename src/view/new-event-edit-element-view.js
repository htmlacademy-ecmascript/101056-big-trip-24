import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeDueDate } from '../utils/event';
import { EVENTS_TYPES } from '../const';

const TIME_PATTERN = 'DD/MM/YY hh:mm';

const createNewOffer = (offer) => {
  const {title, price} = offer;
  return `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
                        <label class="event__offer-label" for="event-offer-luggage-1">
                          <span class="event__offer-title">${title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${price}</span>
                        </label>
                      </div>`;
};

const createOffers = (offers) => {
  let offersHTML = '';
  offers.forEach((offer) => {
    offersHTML += createNewOffer(offer);
  });
  return offersHTML;
};

const createType = (type) => {
  const typeToLowerCase = type.toLowerCase();
  return `<div class="event__type-item">
                          <input id="event-type-${typeToLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeToLowerCase}">
                          <label class="event__type-label  event__type-label--${typeToLowerCase}" for="event-type-${typeToLowerCase}-1" data-event-type="${type}" >${type}</label>
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

const createNewEventEditElementTemplate = (eventData, destinationsList) => {
  const {basePrice, type, offers, destination, dateStart, dateEnd} = eventData;

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
                    <input class="event__input  event__input--destination" id="${destination.id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                    ${createDestinations(destinationsList)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
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
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${createOffers(offers)}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.description}</p>
                  </section>
                </section>
              </form>
            </li>`;
};

export default class NewEventEditElementView extends AbstractStatefulView {
  #eventData = null;
  #handleClick = null;
  #rollupButton = null;
  #getDestinationsData = null;

  #handleSubmit = null;
  #formElement = null;

  constructor ({userEvent, onClick, findDestination, getDestinationsData, onSubmit}) {
    super();
    this.#eventData = userEvent;
    this.findDestinationData = findDestination;
    this.#getDestinationsData = getDestinationsData;
    this._setState(NewEventEditElementView.parseEventDataToState(userEvent));

    this.#handleClick = onClick;
    this.#handleSubmit = onSubmit;

    this._restoreHandlers();

  }

  get template () {
    return createNewEventEditElementTemplate(this._state, this.#getDestinationsData());
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
    this.#rollupButton.addEventListener('click', this.#clickHandler);

    this.element.querySelector('#event-price-1')
      .addEventListener('input', this.#eventPriceToggleHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#eventDestinationToggleHandler);

    this.element.querySelector('#event-start-time-1')
      .addEventListener('input', this.#eventStartTimeToggleHandler);
    this.element.querySelector('#event-end-time-1')
      .addEventListener('input', this.#eventEndTimeToggleHandler);
    this.element.querySelectorAll('.event__type-label')
      .forEach((label) => {
        label.addEventListener('click', this.#eventEventTypeToggleHandler);
      });

  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick(this.#eventData);
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick(NewEventEditElementView.parseStateToEventData(this._state));
  };

  removeEventListeners() {
    this.#rollupButton.removeEventListener('click', this.#clickHandler);
    this.#formElement.removeEventListener('submit', this.#submitHandler);
  }

  static parseEventDataToState(eventData) {
    return {...eventData,
      dateStart: humanizeDueDate(eventData.dateFrom, TIME_PATTERN),
      dateEnd: humanizeDueDate(eventData.dateTo, TIME_PATTERN),
    };
  }

  static parseStateToEventData(state) {
    const eventData = {...state};

    delete eventData.dateStart;
    delete eventData.dateEnd;

    return eventData;
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

        const selectedDestination = this.findDestinationData(cityId);

        if (selectedDestination) {
          this.updateElement({
            destination: selectedDestination,
          });
        }
      }
    });
  };

  #eventStartTimeToggleHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      dateStart: evt.target.value,
    });
  };

  #eventEndTimeToggleHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      dateEnd: evt.target.value,
    });
  };

  #eventEventTypeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.dataset.eventType,
    });
  };

}
