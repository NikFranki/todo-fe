import getTextWidth from './get-text-width';

const getPerTextWidth = (text = 'hello', font = '14px Roboto') => {
  return Math.ceil(getTextWidth(text, font) / text.length);
};

export default getPerTextWidth;
