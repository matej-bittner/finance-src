export const removeEmptyStrings = (data: any) => {
  return Object.entries(data)
    .filter(([key, value]) => value !== "")
    .reduce((obj, [key, value]) => {
      // @ts-ignore
      obj[key] = value;
      return obj;
    }, {});
};
