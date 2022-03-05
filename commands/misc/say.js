const discord = require("discord.js")
const error = require('../../util/error.js')
const _prefix = require('../../util/prefix.js')

module.exports = {
  name: "say",
  category: "admin",
  description: "Says something as the bot",
  usage: "say (normal/embed) (channel) (message)",
  aliases: [""],
  noPerms: false,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    if (message.member.permissions.has(discord.Permissions.FLAGS.ADMINISTRATOR)) {
      let chan = message.mentions.channels.first()
      if(args[0] == "normal") {
        if(!chan) return message.channel.send({ embeds: [new error("You must specify a channel!")] })
        if(!args[2]) return message.channel.send({ embeds: new error("You must specify a message!") })
        chan.send(args.slice(2).join(" "))
      } else if(args[0] == "embed") {
        if(!chan) return message.channel.send({ embeds: [new error("You must specify a channel!")] })
        //if(!args[2]) return message.channel.send(config.error + " You need to specify a title!")
        if(!args[2]) return message.channel.send({ embeds: [new error("You must specify a message!")] })
        let embed = new discord.MessageEmbed()
        //.setTitle(args[2].replace(/%/g, " "))
        .setDescription(args.slice(2).join(" "))
        .setColor(color)
        .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
        chan.send({ embeds: [embed] })
      } else {
        message.channel.send({ embeds: [new error("You must specify a type! (embed/normal)")] })
      }
    } else {
      message.channel.send({ embeds: [new error("You don't have the required permissions!")] })
    }
  }
}
