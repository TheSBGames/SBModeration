const AutoModSettings = require('../models/AutoModSettings');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const member = message.member;
    const settings = await AutoModSettings.findOne({ guildId: message.guild.id });
    if (!settings) return;

    const isAdmin = member.permissions.has('Administrator') || message.guild.ownerId === message.author.id;
    const hasBypass = settings.bypassRoleId && member.roles.cache.has(settings.bypassRoleId);
    if (isAdmin || hasBypass) return; // Bypass automod

    // 🚫 Bad words
    if (settings.badWordsEnabled) {
      const badWords = ['badword1', 'examplebad', 'nastyword']; // Add yours
      if (badWords.some(word => message.content.toLowerCase().includes(word))) {
        try {
          await message.delete();
          await member.timeout(60_000, 'Used a bad word');
          return message.channel.send(`${member} has been timed out for using inappropriate language.`);
        } catch (err) {
          console.error('Failed to timeout:', err);
        }
      }
    }

    // 🔗 Links
    if (settings.linksEnabled) {
      const linkRegex = /(https?:\/\/[^\s]+)/g;
      if (linkRegex.test(message.content)) {
        try {
          await message.delete();
          await member.timeout(60_000, 'Sent a link');
          return message.channel.send(`${member} has been timed out for sending a link.`);
        } catch (err) {
          console.error('Failed to timeout:', err);
        }
      }
    }
  }
};
