const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const autoresponderSchema = require('../../models/autoresponder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-responder')
    .setDescription('Add a new autoresponder')
    .addStringOption(opt =>
      opt.setName('trigger')
        .setDescription('Trigger text')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('response')
        .setDescription('Bot response')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute(interaction) {
    const trigger = interaction.options.getString('trigger');
    const response = interaction.options.getString('response');

    await autoresponderSchema.create({
      guildId: interaction.guild.id,
      trigger,
      response
    });

    await interaction.reply({ content: `✅ Autoresponder added.\nTrigger: \`${trigger}\`\nResponse: \`${response}\``, ephemeral: true });
  }
};
