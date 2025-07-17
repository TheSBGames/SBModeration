module.exports = function cleanString(str) {
    return str.replace(/[`@#]/g, '').trim();
};
