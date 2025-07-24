// commands/admin/npanel.js
const { SlashCommandBuilder } = require('discord.js');
const menu = require('../../components/menus/noPrefix/menu');

module.exports = {
  data: new SlashCommandBuilder().setName('npanel').setDescription('Open no-prefix management GUI'),
  async execute(interaction) {
    menu(interaction);
  }
};
