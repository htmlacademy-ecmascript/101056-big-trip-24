const EVENTS_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];


const CITIES = {
  '0fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'New York',
  '1fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'Tokyo',
  '2fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'Paris',
  '3fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'London',
  '4fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'Sydney',
  '5fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'Berlin',
  '6fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'Rio de Janeiro',
  '7fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'Moscow',
  '8fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'Cairo',
  '9fa5cb75-a1fe-4b77-a83c-0e528e910e04': 'Cape Town'
};

const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. ',
  'Nunc fermentum tortor ac porta dapibus. ',
  'In rutrum ac purus sit amet tempus.'
];

const getEventsTypes = () => EVENTS_TYPES;
const getCities = () => CITIES;
const getSentences = () => SENTENCES;

export {
  getEventsTypes,
  getCities,
  getSentences
};
