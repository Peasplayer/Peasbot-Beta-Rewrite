const discord = require("discord.js")
const error = require('../../util/error.js')
const _prefix = require('../../util/prefix.js')

module.exports = {
  name: "",
  category: "",
  description: "",
  usage: "",
  aliases: [""],
  noPerms: true,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    let footer = config.footer.replace("%prefix%", prefix)
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send({ embeds: [new error("You don't have the required permissions!")] })
    
  }
}
