const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user.")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Select a user")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    await interaction.reply({
      embeds: [{
        color: 0x7289DA,
        author: {
          name: user.tag,
          icon_url: user.displayAvatarURL({ dynamic: true })
        },
        thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
        fields: [
          { name: "User ID", value: user.id },
          { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>` },
          { name: "Joined Server", value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "N/A" },
          { name: "Roles", value: member ? member.roles.cache.map(r => r.name).join(", ") : "N/A" }
        ]
      }]
    });
  }
};
