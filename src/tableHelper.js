export const getValue = (object, path, fallback = '') => {
  const keys = path.split('.');
  let value = object;

  for (let i = 0; i < keys.length; i++) {
    if (!value.hasOwnProperty(keys[i])) {
      return fallback;
    }
    value = value[keys[i]];
  }

  return value;
};
