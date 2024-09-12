import dayjs from 'dayjs';

const humanizeDueDate = (dueDate, dateFormat) => dueDate ? dayjs(dueDate).format(dateFormat) : '';

export {
  humanizeDueDate
};
