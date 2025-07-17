const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const autoresponderSchema = require('../../models/autoresponder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list-responders')
    .setDescription('List all configured autoresponders')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute(interaction) {
    const entries = await autoresponderSchema.find({ guildId: interaction.guild.id });

    if (!entries.length) {
      return interaction.reply({ content: '⚠️ No autoresponders set for this server.', ephemeral: true });
    }

    const formatted = entries
      .map((entry, i) => `**${i + 1}.** \`${entry.trigger}\` → \`${entry.response}\``)
      .join('\n');

    await interaction.reply({ content: `📜 **Autoresponders:**\n${formatted}`, ephemeral: true });
  }
};
