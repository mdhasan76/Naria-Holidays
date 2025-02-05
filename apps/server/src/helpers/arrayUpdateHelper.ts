export const arrayUpdateHelper = (
  propName: string,
  arrayProp: object[] | undefined,
  updateVariable: object
) => {
  if (arrayProp && arrayProp.length > 0) {
    arrayProp.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        const arrayPropKey = `${propName}.$[${"elem"}].${key}`;
        (updateVariable as any)[arrayPropKey] = item[key as keyof typeof item];
      });
    });
  }
};
