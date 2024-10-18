export function debounce(cb, timer) {
  let timerId;

  return function (value) {
    clearTimeout(timerId);
    timerId = setTimeout(cb.bind(this, value), timer);
  };
}
