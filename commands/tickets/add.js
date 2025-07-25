// File: commands/ticket/add.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-add')
    .setDescription('Add a user to a ticket')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to add to the ticket')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const channel = interaction.channel;

    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ You can only use this in a ticket channel.', ephemeral: true });
    }

    try {
      await channel.permissionOverwrites.edit(user.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      });

      await interaction.reply({ content: `✅ ${user.tag} has been added to the ticket.` });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to add the user to the ticket.', ephemeral: true });
    }
  }
};
