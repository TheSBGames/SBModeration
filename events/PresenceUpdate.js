const AutoModSettings = require('../models/AutoModSettings');

module.exports = {
  name: 'presenceUpdate',
  async execute(oldPresence, newPresence) {
    if (!newPresence || !newPresence.guild || !newPresence.member) return;

    const settings = await AutoModSettings.findOne({ guildId: newPresence.guild.id });
    if (!settings || !settings.externalAppDetection) return;

    const member = newPresence.member;

    const isAdmin = member.permissions.has('Administrator') || newPresence.guild.ownerId === member.id;
    const hasBypass = settings.bypassRoleId && member.roles.cache.has(settings.bypassRoleId);
    if (isAdmin || hasBypass) return;

    const externalApps = ['Spotify', 'FiveM', 'OBS Studio', 'Cheat Engine'];
    const usingExternal = newPresence.activities?.some(activity =>
      activity.type === 0 && externalApps.includes(activity.name)
    );

    if (usingExternal) {
      try {
        await member.timeout(5 * 60_000, 'Using unauthorized external app'); // 5 mins
        const logChannel = newPresence.guild.channels.cache.find(c => c.name === 'automod-logs');
        if (logChannel) {
          logChannel.send(`⚠️ ${member.user.tag} was timed out for using an external app (${usingExternal.name})`);
        }
      } catch (e) {
        console.error('AutoMod timeout failed:', e);
      }
    }
  }
};
