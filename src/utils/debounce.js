export function debounce(func, delay) {
  let timer;
  const context = this;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
