const discord = require("discord.js")
const error = require('../../../util/error.js')
const _prefix = require('../../../util/prefix.js')

module.exports = {
  name: "status",
  category: "",
  description: "",
  usage: "",
  aliases: [""],
  noPerms: false,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    if(message.author.id != config.owner1id && message.author.id != config.owner2id && message.author.id != config.owner3id) return message.channel.send(new error("This command is only for the owner of this bot"))
      if(!args[0]) return message.channel.send(new error("You must specify a status type!"))
      if(!args[1]) return message.channel.send(new error("You must specify a status text!"))
      let text = args.slice(1).join(' ')
      let _text = text
      if(args[0].toUpperCase() == "STREAMING") _text = args.slice(2).join(' ')
      if(text.includes("%users%")) _text = text.replace(/%users%/g, client.users.cache.size)
      if(text.includes("%channels%")) _text = text.replace(/%channels%/g, client.channels.cache.size)
      if(text.includes("%guilds%")) _text = text.replace(/%guilds%/g, client.guilds.cache.size)
      if(args[0].toUpperCase() == "STREAMING") {
        let activity = { name: _text, type: 'STREAMING', url: args[1] }
        client.user.setPresence({ activity: activity, status: 'online' })
        activity.name = text
        db.set("status", activity)
      } else {
        let _activity = { name: _text, type: args[0].toUpperCase() }
        client.user.setPresence({ activity: _activity, status: 'online' })
        _activity.name = text
        db.set("status", _activity)
      }
  }
}
