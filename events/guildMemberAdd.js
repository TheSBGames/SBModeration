const AutoRoleSettings = require('../models/AutoRoleSettings');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {
    const settings = await AutoRoleSettings.findOne({ guildId: member.guild.id });
    if (!settings || !settings.enabled) return;

    const roleId = member.user.bot ? settings.botRoleId : settings.humanRoleId;
    if (!roleId) return;

    const role = member.guild.roles.cache.get(roleId);
    if (role) {
      member.roles.add(role).catch(() => {});
    }
  },
};
