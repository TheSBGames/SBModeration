const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  async get(guildId) {
    return await db.get(`guild_${guildId}`);
  },

  async set(guildId, data) {
    return await db.set(`guild_${guildId}`, data);
  },

  async update(guildId, newData) {
    const current = await db.get(`guild_${guildId}`) || {};
    return await db.set(`guild_${guildId}`, { ...current, ...newData });
  },

  async delete(guildId) {
    return await db.delete(`guild_${guildId}`);
  }
};
