const discord = require("discord.js")

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'ping',
    description: 'Get the ping of the bot',
    options: []
  },
  run: async (client, interaction) => {
    const color = config.color

    interaction.reply(`🏓Pong! ${client.ws.ping}ms`)
  }
}
