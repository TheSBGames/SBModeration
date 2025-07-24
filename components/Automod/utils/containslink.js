module.exports = function containsLinks(text) {
  if (!text) return false;
  const linkRegex = /https?:\/\/[^\s]+/gi;
  return linkRegex.test(text);
};
