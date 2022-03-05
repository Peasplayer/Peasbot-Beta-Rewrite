const discord = require("discord.js")
const parsems = require('parse-ms')

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'about',
    description: 'Get information about the bot and it\'s coder',
    options: []
  },
  run: async (client, interaction) => {
    const color = config.color

    let embed = new discord.MessageEmbed()
        .setTitle("About")
        .setColor(color)
        .setAuthor(client.user.username + "#" + client.user.discriminator, client.user.avatarURL())
        .setDescription("The bot was developed by <@568421310531764241> and translated by <@548556416236126229>\n\n❓ - [Support server](https://discord.gg/nQB5EZe)\n\n❓ - [Website](https://www.peasbot.tk)" + `\n\n⏲️- Uptime: ${parsems(client.uptime).days}d ${parsems(client.uptime).hours}h and ${parsems(client.uptime).minutes}m`)

    interaction.reply({ embeds: [embed] })
  }
}