import dayjs from 'dayjs';
import { LOCALE_DAY_OF_WEEK, LOCALE_MONTH } from '@constant/index';

const getDueDateDayText = (date) => {
  const dueDateDay = dayjs(date).day();
  const dueDateDate = dayjs(date).date();
  const dueDateFormat = dayjs(date).format('YYYY-MM-DD');
  const dueDateMonth = dayjs(date).month();
  const todayDateFormat = dayjs().format('YYYY-MM-DD');
  const tomorrowDateFormat = dayjs().add(1, 'day').format('YYYY-MM-DD');

  return dueDateFormat === todayDateFormat
    ? 'Today'
    : dueDateFormat === tomorrowDateFormat
    ? 'Tomorrow'
    : // eslint-disable-next-line max-len
      `${LOCALE_DAY_OF_WEEK[dueDateDay]}, ${LOCALE_MONTH[dueDateMonth]} ${dueDateDate}`;
};

export default getDueDateDayText;
