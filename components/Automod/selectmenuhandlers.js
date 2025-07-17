const db = require('../../schemas/automodConfig');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    async handleAutomodSelect(interaction) {
        const guildId = interaction.guild.id;
        let settings = await db.findOne({ guildId });

        if (!settings) {
            settings = new db({ guildId });
        }

        const id = interaction.customId;

        if (id === 'bypass_role_select') {
            const selectedRoleId = interaction.values[0];
            settings.bypassRole = selectedRoleId;
            await settings.save();

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🛡️ Bypass Role Set')
                .setDescription(`Members with <@&${selectedRoleId}> will be bypassed from AutoMod actions.`);

            return interaction.update({ embeds: [embed], components: [] });
        }

        if (id === 'filter_type_select') {
            const selectedFilters = interaction.values;
            settings.filters = selectedFilters;
            await settings.save();

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🧹 Filters Updated')
                .setDescription(`Enabled filters:\n- ${selectedFilters.map(f => `**${f}**`).join('\n- ')}`);

            return interaction.update({ embeds: [embed], components: [] });
        }
    }
};
