const badWordsList = require('./badWordsList');

module.exports = function containsBadWords(text) {
  if (!text) return false;
  const words = text.toLowerCase().split(/\s+/);
  return words.some(word => badWordsList.includes(word));
};
