module.exports = function isAdmin(member) {
    return (
        member.permissions.has('Administrator') ||
        member.id === member.guild.ownerId
    );
};
