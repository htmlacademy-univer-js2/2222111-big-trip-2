const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElement = (elements) => {
  const MIN = 0;
  const max = elements.length - 1;
  return elements[getRandomInteger(MIN, max)];
};

const toUpperCaseFirstLetter = (value) =>{
  if (!value){
    return value;
  }

  const firstLetter = value[0].toUpperCase();
  const remainingPart = value.slice(1);
  return firstLetter + remainingPart;
};

export {getRandomElement, getRandomInteger, toUpperCaseFirstLetter};

