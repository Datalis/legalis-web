export const removeEmpty = (obj: any) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else if (obj[key] !== undefined && obj[key] !== null) newObj[key] = obj[key];
  });
  return newObj;
};
