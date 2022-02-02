import moment from 'moment';

export const localTime = (date?: string | Date): string => {
  return moment.utc(date).local().format(process.env.REACT_APP_TIME_FORMAT);
};
