const filters = [
  require('./filters/anti-link'),
  require('./filters/anti-badwords'),
  require('./filters/anti-invite'),
  require('./filters/anti-spam'),
  require('./filters/anti-external-apps')
];

module.exports = async (message, client) => {
  if (!message.guild || message.author.bot) return;

  for (const filter of filters) {
    try {
      await filter(message, client);
    } catch (err) {
      console.error(`[AUTOMOD] Error in filter ${filter.name}:`, err);
    }
  }
};
