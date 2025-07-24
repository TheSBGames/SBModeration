module.exports = async function isBypassed(member, settings) {
  const bypassRoleId = settings?.automod?.bypassRole;
  if (!bypassRoleId) return false;
  return member.roles.cache.has(bypassRoleId) || member.permissions.has('Administrator');
};
