const db = require('../database');

module.exports = async function checkDJ(member) {
    const settings = await db.get(`djrole_${member.guild.id}`);
    if (!settings || !settings.enabled) return true; // Everyone has access

    const djRole = member.guild.roles.cache.get(settings.roleId);
    if (!djRole) return true; // If role is deleted, fallback

    return member.roles.cache.has(djRole.id);
};
