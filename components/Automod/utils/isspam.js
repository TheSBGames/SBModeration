const userMessageCache = new Map();

module.exports = function isSpam(userId, content) {
  const now = Date.now();
  const cache = userMessageCache.get(userId) || [];

  // Keep only messages within last 10 seconds
  const recent = cache.filter(msg => now - msg.time < 10000);
  recent.push({ content, time: now });

  userMessageCache.set(userId, recent);

  // If user sends same message more than 3 times in 10 seconds
  const repeated = recent.filter(msg => msg.content === content);
  return repeated.length >= 3;
};
