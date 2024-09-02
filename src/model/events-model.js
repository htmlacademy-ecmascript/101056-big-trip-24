import { getRandomEvents } from '../mock/events';

const EVENTS_COUNT = 3;

export default class EventsModel {
  // events = Array.from({length: EVENTS_COUNT}, getRandomEvent);
  events = getRandomEvents(EVENTS_COUNT);

  getEvents () {
    return this.events;
  }
}
