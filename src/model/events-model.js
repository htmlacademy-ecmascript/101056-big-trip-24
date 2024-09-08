import { getRandomEvents } from '../mock/events';
import { getRandomOffers } from '../mock/offers';
import { convertKeysToCamelCase } from '../utils/utils';
import { getRandomDestinations } from '../mock/destinations';

const EVENTS_COUNT = 3;

export default class EventsModel {
  offersList = convertKeysToCamelCase(getRandomOffers());
  destinationsList = convertKeysToCamelCase(getRandomDestinations());
  eventsList = convertKeysToCamelCase(getRandomEvents(EVENTS_COUNT, this.destinationsList));

  getUserEvents () {
    return this.eventsList;
  }

  getDestination (id) {
    const item = this.destinationsList.find((element) => element.id === id);
    return item ? item : null;
  }

  getOffer(offers, offerId) {
    return offers.flatMap((offerType) => offerType.offers).find((offer) => offer.id === offerId) || null;
  }

  getOffersByIds(offerIds) {
    return offerIds.map((offerId) => this.getOffer(this.offersList, offerId));
  }
}
