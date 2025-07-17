const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('closeticket')
    .setDescription('Close the current ticket channel.'),

  async execute(interaction) {
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: 'This command can only be used in ticket channels.', ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'You do not have permission to close this ticket.', ephemeral: true });
    }

    await interaction.reply('Closing ticket in 5 seconds...');
    setTimeout(() => {
      interaction.channel.delete().catch(() => null);
    }, 5000);
  }
};
