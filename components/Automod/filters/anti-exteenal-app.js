const settings = require('../../../database/guild-settings');

module.exports = async (message, client) => {
  const guildSettings = await settings.get(message.guild.id);
  if (!guildSettings?.automod?.antiExternalApps?.enabled) return;

  const member = message.member;
  const presences = member.presence?.activities || [];

  const forbiddenApps = ['Spotify', 'FiveM', 'Roblox'];
  const matchedApp = presences.find(p => forbiddenApps.includes(p.name));

  if (matchedApp && member.voice?.channel) {
    if (guildSettings.automod.antiExternalApps.action === 'kick') {
      await member.voice.disconnect().catch(() => {});
    }

    const log = require('../../../utils/logEvent');
    await log(message.guild, 'Anti External App', {
      description: `${member} was using **${matchedApp.name}** and was disconnected from voice.`,
      color: 0xff3333
    });
  }
};
