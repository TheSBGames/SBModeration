const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar.")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Select a user")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });

    await interaction.reply({
      embeds: [{
        color: 0x00AE86,
        title: `${user.username}'s Avatar`,
        image: { url: avatarUrl },
        footer: { text: `Requested by ${interaction.user.tag}` }
      }]
    });
  }
};
