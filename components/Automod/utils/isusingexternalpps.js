module.exports = function isUsingExternalApps(member) {
  const apps = ['fivem', 'spotify', 'discord', 'osu', 'roblox'];
  return member.presence?.activities?.some(activity =>
    apps.some(app => activity.name.toLowerCase().includes(app))
  );
};
