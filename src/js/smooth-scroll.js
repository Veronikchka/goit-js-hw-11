export function smoothScroll(obj) {
  const { height: cardHeight } = document
    .querySelector(obj)
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}