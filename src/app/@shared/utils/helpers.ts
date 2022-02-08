export const removeEmpty = (obj: any) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else if (obj[key] !== undefined && obj[key] !== null) newObj[key] = obj[key];
  });
  return newObj;
};

export const groupBy = (xs: any[], key: string) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const range = (from: number, to: number, step = 1) =>
  [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);

export const flatten = function (arr: any[], result: any[] = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      flatten(value, result);
    } else {
      result.push(value);
    }
  }
  return result;
};