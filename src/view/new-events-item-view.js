import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';
import { humanizeDueDate } from '../utils/event';

const TIME_PATTERN = 'hh:mm';
const HUMANIZED_EVENT_DATE_PATTERN = 'MMM DD';


const getTimeDifference = (timeStart, timeEnd) => {
  const start = dayjs(timeStart);
  const end = dayjs(timeEnd);

  const differenceInDays = end.diff(start, 'day');
  const differenceInHours = end.diff(start, 'hour') % 24;
  const differenceInMinutes = end.diff(start, 'minute') % 60;

  if (differenceInDays > 0) {
    return `${String(differenceInDays).padStart(2, '0')}D ${String(differenceInHours).padStart(2, '0')}H ${String(differenceInMinutes).padStart(2, '0')}M`;
  } else if (differenceInHours > 0) {
    return `${String(differenceInHours).padStart(2, '0')}H ${String(differenceInMinutes).padStart(2, '0')}M`;
  } else {
    return `${String(differenceInMinutes).padStart(2, '0')}M`;
  }
};

const createNewOffer = (offer) => {
  const {title, price} = offer;
  return `<li class="event__offer">
                    <span class="event__offer-title">${title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${price}</span>
                  </li>`;
};

const createOffers = (offers) => {
  let offersHTML = '';
  offers.forEach((offer) => {
    offersHTML += createNewOffer(offer);
  });
  return offersHTML;
};

const createNewTripEventsItemTemplate = (eventData) => {
  const {basePrice, dateFrom, dateTo, isFavorite, type, offers, destination} = eventData;
  const favoriteButtonClassName = isFavorite ? 'event__favorite-btn--active' : '';

  const humanizedEventDate = humanizeDueDate(dateFrom, HUMANIZED_EVENT_DATE_PATTERN);

  const humanizedStartTime = humanizeDueDate(dateFrom, TIME_PATTERN);
  const humanizedEndTime = humanizeDueDate(dateTo, TIME_PATTERN);

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom}">${humanizedEventDate}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${humanizedStartTime}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${humanizedEndTime}</time>
                  </p>
                  <p class="event__duration">${getTimeDifference(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                ${createOffers(offers)}
                </ul>
                <button class="event__favorite-btn ${favoriteButtonClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>

                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>

              </div>
            </li>`;
};

export default class NewEventsItemView extends AbstractView {
  #eventData = null;
  #handleClick = null;
  #rollupButton = null;

  constructor ({userEvent, onClick}) {
    super();
    this.#eventData = userEvent;
    this.#handleClick = onClick;
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#rollupButton.addEventListener('click', this.#clickHandler);
  }

  get template () {
    return createNewTripEventsItemTemplate(this.#eventData);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  removeEventListeners() {
    this.#rollupButton.removeEventListener('click', this.#clickHandler);
  }

}
