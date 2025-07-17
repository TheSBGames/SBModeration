const { EmbedBuilder } = require('discord.js');
const db = require('../../schemas/automodConfig');

module.exports = {
    async handleAutomodButton(interaction) {
        const guildId = interaction.guild.id;
        let settings = await db.findOne({ guildId });

        if (!settings) {
            settings = new db({ guildId });
        }

        const id = interaction.customId;

        if (id.startsWith('action_')) {
            const action = id.split('_')[1];
            settings.action = action;
            await settings.save();

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('✅ Action Set')
                .setDescription(`Violations will now trigger **${action.charAt(0).toUpperCase() + action.slice(1)}**.`);

            return interaction.update({ embeds: [embed], components: [] });
        }

        if (id === 'save_settings') {
            await settings.save();
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('💾 Settings Saved')
                .setDescription('Your AutoMod configuration has been saved successfully!');
            return interaction.update({ embeds: [embed], components: [] });
        }

        if (id === 'cancel_settings') {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ Settings Cancelled')
                .setDescription('No changes were saved.');
            return interaction.update({ embeds: [embed], components: [] });
        }
    }
};
