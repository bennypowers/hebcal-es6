import {flags} from './event';
import {months} from './hdate';

const NONE = 0;
const HALF = 1;
const WHOLE = 2;

/**
 * Return a number containing information on what Hallel is said on that day.
 *
 * Whole Hallel is said on Chanukah, the first Yom Tov of Pesach, Shavuot, Sukkot, Yom Ha'atzmaut, and Yom Yerushalayim.
 * Half Hallel is said on Rosh Chodesh (not Rosh Hashanah), and the last 6 days of Pesach.
 *
 * The number is one of the following values:
 *
 * 0 - No Hallel
 * 1 - Half Hallel
 * 2 - Whole Hallel
 *
 * @param {Event[]} events
 * @param {HDate} hdate
 * @return {number}
 */
export function hallel_(events, hdate) {
  const whole = events.filter((ev) => {
    /** @type {string} */
    const desc = ev.getDesc();
    /** @type {HDate} */
    const hd = ev.getDate();
    const month = hd.getMonth();
    const mday = hd.getDate();
    return desc.startsWith('Chanukah') ||
      desc.startsWith('Shavuot') ||
      desc.startsWith('Sukkot') ||
      (month === months.NISAN && (mday === 15 || mday === 16) && (ev.getFlags() & flags.CHAG)) || // Pesach
      desc === 'Yom HaAtzma\'ut' ||
      desc === 'Yom Yerushalayim';
  }).map((ev) => {
    return ev.getDate().abs();
  });

  const abs = hdate.abs();
  if (whole.includes(abs)) {
    return WHOLE;
  }

  const half = events.filter((ev) => {
    const desc = ev.getDesc();
    return ev.getFlags() & flags.ROSH_CHODESH ||
      (desc.startsWith('Pesach') && desc !== 'Pesach I' && desc !== 'Pesach II');
  }).map((ev) => {
    return ev.getDate().abs();
  });

  if (half.includes(abs)) {
    return HALF;
  }

  return NONE;
}
