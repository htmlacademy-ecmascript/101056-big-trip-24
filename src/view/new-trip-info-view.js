import AbstractView from '../framework/view/abstract-view';
import { humanizeDueDate } from '../utils/event';

const DATE_PATTERN = 'DD MMM';

const createNewTripInfoTemplate = (generalTravelInformation) =>{
  const {journeyDates, totalPrice, travelRoute} = generalTravelInformation;
  let humanizedStartTime = '';
  let humanizedEndTime = '';
  let datesInfo = '';

  if (travelRoute) {
    humanizedStartTime = humanizeDueDate(journeyDates.journeyStart, DATE_PATTERN);
    humanizedEndTime = humanizeDueDate(journeyDates.journeyEnd, DATE_PATTERN);
    datesInfo = `${ humanizedStartTime } - ${ humanizedEndTime }`;
  }

  return `<section class="trip-main__trip-info trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${travelRoute || ''}</h1>

              <p class="trip-info__dates">${datesInfo || ''}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice !== undefined ? totalPrice : '0'}</span>
            </p>
          </section>`;
};

export default class NewTripInfoView extends AbstractView {
  #generalTravelInformation = null;

  constructor({generalTravelInformation}) {
    super();
    this.#generalTravelInformation = generalTravelInformation;
  }

  get template () {
    return createNewTripInfoTemplate(this.#generalTravelInformation);
  }
}
