import dayjs from 'dayjs';

const humanizeDueDate = (dueDate, dateFormat) => dueDate ? dayjs(dueDate).format(dateFormat) : '';

const isEventFuture = (dateFrom) => dateFrom && dayjs().isAfter(dateFrom, 'D');

const isEventPresent = (dateFrom, dateTo) => {
  const now = dayjs();
  return dateFrom && dateTo &&
  now.isAfter(dateFrom, 'D') &&
  now.isBefore(dateTo, 'D') ||
  now.isSame(dateTo, 'D');
};

const isEventPast = (dateTo) => dateTo && dayjs().isAfter(dateTo, 'D');

export {
  humanizeDueDate,
  isEventFuture,
  isEventPresent,
  isEventPast
};
