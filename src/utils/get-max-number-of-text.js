const getMaxNumberOfText = (maxWidth, perTextWidth) => {
  return Math.ceil(maxWidth / perTextWidth);
};

export default getMaxNumberOfText;
