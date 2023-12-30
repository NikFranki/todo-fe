import dayjs from 'dayjs';
import { LOCALE_DAY_OF_WEEK, LOCALE_MONTH } from '@constant/index';

const getDateDayText = (date: string) => {
  const dateDay = dayjs(date).day();
  const dateDate = dayjs(date).date();
  const dateFormat = dayjs(date).format('YYYY-MM-DD');
  const dateMonth = dayjs(date).month();
  const todayDateFormat = dayjs().format('YYYY-MM-DD');
  const tomorrowDateFormat = dayjs().add(1, 'day').format('YYYY-MM-DD');

  return dateFormat === todayDateFormat
    ? 'Today'
    : dateFormat === tomorrowDateFormat
      ? 'Tomorrow'
      : // eslint-disable-next-line max-len
      `${LOCALE_DAY_OF_WEEK[dateDay]}, ${LOCALE_MONTH[dateMonth]} ${dateDate}`;
};

export default getDateDayText;
