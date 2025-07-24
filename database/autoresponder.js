const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  async add(guildId, trigger, response) {
    const current = (await db.get(`autoresponders_${guildId}`)) || [];
    current.push({ trigger, response });
    return await db.set(`autoresponders_${guildId}`, current);
  },

  async remove(guildId, trigger) {
    let current = (await db.get(`autoresponders_${guildId}`)) || [];
    current = current.filter(r => r.trigger !== trigger);
    return await db.set(`autoresponders_${guildId}`, current);
  },

  async getAll(guildId) {
    return await db.get(`autoresponders_${guildId}`) || [];
  },

  async clear(guildId) {
    return await db.delete(`autoresponders_${guildId}`);
  }
};
