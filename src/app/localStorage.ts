export default class LS {
  static get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {
      return localStorage.getItem(key);
    }
  }
  static set(key: string, value: string | object) {
    typeof value === "object"
      ? localStorage.setItem(key, JSON.stringify(value))
      : localStorage.setItem(key, value);
  }
  static remove(key: string) {
    localStorage.removeItem(key);
  }
}
