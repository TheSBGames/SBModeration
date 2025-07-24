const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  async set(guildId, data) {
    return await db.set(`autorole_${guildId}`, data);
  },

  async get(guildId) {
    return await db.get(`autorole_${guildId}`) || {
      enabled: false,
      humanRole: null,
      botRole: null
    };
  },

  async update(guildId, newData) {
    const current = await this.get(guildId);
    return await db.set(`autorole_${guildId}`, { ...current, ...newData });
  },

  async clear(guildId) {
    return await db.delete(`autorole_${guildId}`);
  }
};
