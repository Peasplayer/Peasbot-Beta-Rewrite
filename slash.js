require('dotenv').config();
const discord = require('discord.js')

module.exports = async (client) => {
  const slash = require("slash-commands");
  const interaction = new slash.DiscordInteractions({
    applicationId: process.env.clientId,
    authToken: process.env.bot_token,
    publicKey: process.env.publicKey,
  });
}