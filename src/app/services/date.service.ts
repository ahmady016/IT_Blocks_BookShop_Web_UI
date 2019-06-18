import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateService {
  Days() {
    let result: string[] = [];
    for (let i = 1; i <= 31; i++)
      result.push(i.toString());
    return result;
  }
  Months() {
    return [['1', 'Jan'], ['2', 'Feb'], ['3', 'Mar'], ['4', 'Apr'], ['5', 'May'], ['6', 'Jun'], ['7', 'Jul'], ['8', 'Aug'], ['9', 'Sep'], ['10', 'Oct'], ['11', 'Nov'], ['12', 'Dec']];
  }
  Years(backTo) {
    let result: string[] = [];
    const currYear = (new Date()).getFullYear(),
      oldYear = currYear - backTo;
    for (let i = currYear; i >= oldYear; i--)
      result.push(i.toString());
    return result;
  }
  isValidDate(day: number, month: number, year: number): boolean {
    const isLeapYear = (year) => ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    if (day === 31 && (month === 2 || month === 4 || month === 6 || month === 9 || month === 11))
      return false;
    if (day === 30 && month === 2)
      return false;
    if (day === 29 && !isLeapYear(year))
      return false;
    return true;
  }
  toSqlFormat(date: string): string {
    return date.split('/')
      .reverse()
      .join('-')
  }
}
