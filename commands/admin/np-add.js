// commands/admin/np-add.js
const { SlashCommandBuilder } = require('discord.js');
const NoPrefix = require('../../schemas/noPrefix');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('npadd')
    .setDescription('Add a user to the no-prefix list')
    .addUserOption(opt => opt.setName('user').setDescription('User to add').setRequired(true))
    .addStringOption(opt =>
      opt.setName('duration')
        .setDescription('Duration (e.g., 10m, 1w, 1y, permanent)')
        .setRequired(true)),
  
  async execute(interaction) {
    if (interaction.user.id !== '1186506712040099850') {
      return interaction.reply({ content: 'Only the bot owner can use this.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');

    let expiresAt = null;
    if (duration !== 'permanent') {
      try {
        expiresAt = new Date(Date.now() + ms(duration));
      } catch {
        return interaction.reply({ content: 'Invalid duration format.', ephemeral: true });
      }
    }

    await NoPrefix.findOneAndUpdate(
      { userId: user.id },
      { userId: user.id, expiresAt },
      { upsert: true }
    );

    interaction.reply(`✅ ${user.tag} can now use commands without prefix for **${duration}**.`);
  }
};
