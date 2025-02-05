export const updateHelper = (
  propName: string,
  prop: object | undefined,
  updateVariable: object
) => {
  if (prop && Object.keys(prop).length > 0) {
    Object.keys(prop).forEach(key => {
      const propKey = `${propName}.${key}` // expected output: 'name.firstName' or 'name.middleName' or 'prop.lastName'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(updateVariable as any)[propKey] = prop[key as keyof typeof prop]
    })
  }
}
