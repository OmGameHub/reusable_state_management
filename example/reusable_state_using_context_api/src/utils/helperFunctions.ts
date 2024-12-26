export const classNames = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
}


/**
 * A map of format tokens to their corresponding formatting functions.
 */
const formatters: { [key: string]: (date: Date) => string | number } = {
  /**
   * Formats the year as a four-digit number. (e.g., 2023)
   */
  YYYY: (date) => date.getFullYear(),
  yyyy: (date) => date.getFullYear(),
  /**
   * Formats the year as a two-digit number. (e.g., 23)
   */
  yy: (date) => date.getFullYear().toString().slice(-2),
  /**
   * Formats the month as a long string. (e.g., January, February)
   */
  MMMM: (date) => date.toLocaleString("default", { month: "long" }),
  /**
   * Formats the month as a short string. (e.g., Jan, Feb)
   */
  MMM: (date) => date.toLocaleString("default", { month: "short" }),
  /**
   * Formats the month as a two-digit number. (e.g., 01, 02)
   */
  MM: (date) => String(date.getMonth() + 1).padStart(2, "0"),
  /**
   * Formats the month as a number. (e.g., 1, 2)
   */
  M: (date) => date.getMonth() + 1,
  /**
   * Formats the day of the week as a long string. (e.g., Monday, Tuesday)
   */
  DDDD: (date) => date.toLocaleString("default", { weekday: "long" }),
  dddd: (date) => date.toLocaleString("default", { weekday: "long" }),
  /**
   * Formats the day of the week as a short string. (e.g., Mon, Tue)
   */
  DDD: (date) => date.toLocaleString("default", { weekday: "short" }),
  ddd: (date) => date.toLocaleString("default", { weekday: "short" }),
  /**
   * Formats the day of the month as a two-digit number. (e.g., 01, 02)
   */
  DD: (date) => String(date.getDate()).padStart(2, "0"),
  dd: (date) => String(date.getDate()).padStart(2, "0"),
  /**
   * Formats the day of the month as a number. (e.g., 1, 2)
   */
  D: (date) => date.getDate(),
  d: (date) => date.getDate(),
  /**
   * Formats the hour in 24-hour format as a two-digit number. (e.g., 00, 13)
   */
  HH: (date) => String(date.getHours()).padStart(2, "0"),
  /**
   * Formats the hour in 24-hour format as a number. (e.g., 0, 13)
   */
  H: (date) => date.getHours(),
  /**
   * Formats the hour in 12-hour format as a two-digit number. (e.g., 00, 01)
   */
  hh: (date) => String(date.getHours() % 12).padStart(2, "0"),
  /**
   * Formats the hour in 12-hour format as a number. (e.g., 0, 1)
   */
  h: (date) => date.getHours() % 12,
  /**
   * Formats the minute as a two-digit number. (e.g., 00, 59)
   */
  mm: (date) => String(date.getMinutes()).padStart(2, "0"),
  /**
   * Formats the minute as a number. (e.g., 0, 59)
   */
  m: (date) => date.getMinutes(),
  /**
   * Formats the second as a two-digit number. (e.g., 00, 59)
   */
  ss: (date) => String(date.getSeconds()).padStart(2, "0"),
  /**
   * Formats the second as a number. (e.g., 0, 59)
   */
  s: (date) => date.getSeconds(),
  /**
   * Formats the AM/PM marker in uppercase. (e.g., AM, PM)
   */
  A: (date) => (date.getHours() >= 12 ? "PM" : "AM"),
  /**
   * Formats the AM/PM marker in lowercase. (e.g., am, pm)
   */
  a: (date) => (date.getHours() >= 12 ? "pm" : "am"),
};

/**
 * Formats a date value according to the specified format.
 *
 * @param dateValue - The date value to format, can be a string or a Date object.
 * @param format - The desired format string. If not provided, a default format will be used.
 *
 * @returns The formatted date string, or the original dateValue if it's falsy.
 *
 * @example
 * formatDateTime(new Date(), "yyyy-MM-dd"); // Returns "2023-10-26"
 * formatDateTime("2023-10-26", "MMMM dd, yyyy"); // Returns "October 26, 2023"
 */
export const formatDateTime = (
  dateValue: string | Date,
  format: string = "MMM dd, yyyy",
) => {
  if (!dateValue) return dateValue;

  const date = new Date(dateValue);
  return format.replace(
    /YYYY|yyyy|yy|MMMM|MMM|MM|M|DDDD|dddd|DDD|ddd|DD|dd|D|d|HH|H|hh|h|mm|m|ss|s|A|a/g,
    (match) => formatters[match](date).toString(),
  );
};
