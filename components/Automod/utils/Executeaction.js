module.exports = async function executeAutomodAction(member, action, reason) {
  try {
    switch (action) {
      case 'timeout':
        await member.timeout(10 * 60 * 1000, reason);
        break;
      case 'kick':
        await member.kick(reason);
        break;
      case 'ban':
        await member.ban({ reason });
        break;
      case 'mute':
        const muteRole = member.guild.roles.cache.find(r => r.name.toLowerCase().includes('mute'));
        if (muteRole) await member.roles.add(muteRole, reason);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`Automod action failed: ${err}`);
  }
};
