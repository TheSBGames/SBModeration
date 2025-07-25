const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },

  // Prefix
  prefix: { type: String, default: '&' },

  // Welcome / Leave
  welcomeChannelId: { type: String, default: null },
  welcomeMessage: { type: String, default: null },
  leaveChannelId: { type: String, default: null },
  leaveMessage: { type: String, default: null },

  // Autorole
  autoroleEnabled: { type: Boolean, default: false },
  autoroleHuman: { type: String, default: null },
  autoroleBot: { type: String, default: null },

  // Autoresponders
  autoresponders: [
    {
      trigger: { type: String },
      response: { type: String }
    }
  ],

  // Automod settings
  automod: {
    enabled: { type: Boolean, default: false },
    filters: {
      links: { type: Boolean, default: false },
      invites: { type: Boolean, default: false },
      badWords: { type: Boolean, default: false },
      externalApps: { type: Boolean, default: false }
    },
    actions: {
      onLink: { type: String, default: 'timeout' }, // timeout/mute/kick/ban
      onInvite: { type: String, default: 'timeout' },
      onBadWord: { type: String, default: 'timeout' },
      onExternalApp: { type: String, default: 'log' }
    },
    bypassRoleId: { type: String, default: null }
  },

  // Ticket panel
  ticketPanel: {
    title: { type: String, default: 'Support Panel' },
    description: { type: String, default: 'Select a category to open a ticket.' },
    categories: [
      {
        name: String,
        emoji: String,
        description: String,
        categoryId: String // category under which ticket channels will be created
      }
    ]
  },

  // Transcript settings
  transcriptChannelId: { type: String, default: null },

  // YouTube Notifier
  youtubeChannels: [
    {
      channelId: String,
      notifyChannelId: String,
      lastVideoId: String,
      customMessage: { type: String, default: '📢 New video by **{channel}**: {url}' }
    }
  ],

  // ChatGPT channels (for AI chat)
  chatGPTChannels: [String],

  // Modmail system
  modmailCategoryId: { type: String, default: null },
  modmailLogChannelId: { type: String, default: null }
});

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);
