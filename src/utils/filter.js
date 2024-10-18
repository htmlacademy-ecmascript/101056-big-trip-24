import { FilterType } from '../const';
import { isEventFuture, isEventPresent, isEventPast } from './event';

const filter = {
  [FilterType.EVERYTHING]: (userEvents) => userEvents,
  [FilterType.FUTURE]: (userEvents) => userEvents.filter((userEvent) => isEventFuture(userEvent.dateFrom)),
  [FilterType.PRESENT]: (userEvents) => userEvents.filter((userEvent) => isEventPresent(userEvent.dateFrom, userEvent.dateTo)),
  [FilterType.PAST]: (userEvents) => userEvents.filter((userEvent) => isEventPast(userEvent.dateTo)),
};

export { filter };
