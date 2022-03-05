const request = require('request')
const discord = require("discord.js")

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'mcserverinfo',
    description: 'Get infos about a minecraft server',
    options: [
      {
        name: "serverip",
        description: "The ip of the server you want to get infos about",
        type: "STRING",
        required: true
      }
    ]
  },
  run: async (client, interaction) => {
    const color = config.color

    const serverip = interaction.options.getString("serverip")

    const url = "https://api.mcsrvstat.us/2/" + serverip
    request({
      method: "GET",
      url: url
    }, function(err, res, text) {
      if (err) {
        throw err
        return interaction.reply({ embeds: [new error("Something went wrong! Try again later.")] })
      }

      let data = JSON.parse(text)
      if (data.online == false)
        return interaction.reply({ embeds: [new error("The server is not online, the address is not correct or there is a server problem on our side.")] })

      let embed = new discord.MessageEmbed()
          .setColor(color)
          .setFooter(config.footer, config.footerImg)
          .setThumbnail("https://api.mcsrvstat.us/icon/" + data.hostname)
          .setTitle(serverip)

      let description = `Info about the server:\n\n<:mcip:795286363485241365>|\`IP\`: ${data.ip}:${data.port}\n💬|\`MOTD\`: ${data.motd.clean.toString().replace(/,/g, "\n💬|\`MOTD\`: ")}\n<:mcsteve:795300135277559859>|\`Players\`: ${data.players.online}/${data.players.max}`
      if (data.players.list) description = description + ` (${data.players.list.toString().replace(/,/g, ", ")})`
      description += `\n<:mcsoftware:795283543172317184>|\`Version\`: ${data.version}`
      if (data.map)
        description += `\n<:mcworld:795283341531938866>|\`World\`: ${data.map}`
      if (data.software)
        description += `\n<:mcsoftware:795283543172317184>|\`Software\`: ${data.software}`
      if (data.plugins)
        description += `\n⚙️|\`Plugins\`: ${data.plugins.names.toString().replace(/,/g, ", ")}`
      if (data.mods)
        description += `\n⚙️|\`Mods\`: ${data.mods.names.toString().replace(/,/g, ", ")}`
      embed.setDescription(description)

      interaction.reply({ embeds: [embed] })
    });
  }
}
