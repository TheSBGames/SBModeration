module.exports = async function resolveMember(guild, input) {
    if (!input) return null;

    let member = null;

    if (input.match(/^<@!?(\d+)>$/)) {
        const id = input.match(/^<@!?(\d+)>$/)[1];
        member = await guild.members.fetch(id).catch(() => null);
    } else if (/^\d{17,19}$/.test(input)) {
        member = await guild.members.fetch(input).catch(() => null);
    } else {
        const found = guild.members.cache.find(m =>
            m.user.username.toLowerCase().includes(input.toLowerCase())
        );
        if (found) member = found;
    }

    return member;
};
