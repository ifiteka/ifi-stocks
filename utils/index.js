export const calcPrice = (current, points) => {

  if (points < 0) {
    return current + current * 0.5 * -1;
  }

  if (points === 0) {
    return current + current * 0.25 * -1;
  }

  if (points === 500) {
    return current;
  }

  if (points === 100) {
    return current + current * 0.2 * -1;
  }

  if (points === 200) {
    return current + current * 0.15 * -1;
  }

  if (points === 300) {
    return current + current * 0.1 * -1;
  }

  if (points === 400) {
    return current + current * 0.05 * -1;
  }

  if (points === 600) {
    return current + current * 0.05;
  }

  if (points === 700) {
    return current + current * 0.1;
  }

  if (points === 800) {
    return current + current * 0.15;
  }
};
