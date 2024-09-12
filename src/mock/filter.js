import { filter } from '../utils/filter.js';

function generateFilter(userEvents) {
  return Object.entries(filter).map(
    ([filterType, filterEvents]) => ({
      type: filterType,
      count: filterEvents(userEvents).length,
    }),
  );
}

export { generateFilter };
