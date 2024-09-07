export const calcPercentage = (givenPoints, maxPoints) => {
  return givenPoints / maxPoints;
};

export const calcPrice = (currentPrice, points, maxPoints) => {
  if (points < 0) {
    return currentPrice / 2;
  }

  if (points === maxPoints / 2) {
    return currentPrice;
  }

  const percent = calcPercentage(points, maxPoints);

  return (
    (currentPrice + currentPrice * percent * (percent < 0.5 ? -1 : 1)) / 1000
  );
};

export const skipped = (ctx, value) =>
  ctx.p0.skip || ctx.p1.skip ? value : undefined;
export const down = (ctx, value) =>
  ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
