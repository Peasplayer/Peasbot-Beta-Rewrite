const discord = require("discord.js")

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'uptime',
    description: 'Get the time the bot has been online',
    options: []
  },
  run: async (client, interaction) => {
    const color = config.color

    interaction.reply(`⏲️- Uptime: ${parsems(client.uptime).days}d ${parsems(client.uptime).hours}h and ${parsems(client.uptime).minutes}m`)
  }
}
