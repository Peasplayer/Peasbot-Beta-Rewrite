const discord = require("discord.js")
const error = require('../../../util/error.js')
const _prefix = require('../../../util/prefix.js')

module.exports = {
  name: "friedberger",
  category: "",
  description: "",
  usage: "",
  aliases: [""],
  noPerms: false,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    let footer = config.footer.replace("%prefix%", prefix)
    if(message.author.id != config.owner1id && message.author.id != config.owner2id && message.author.id != config.owner3id) return message.channel.send(new error("This command is only for the owner of this bot"))
    if(!args[0]) {
      let flensis = await db.get(`fried_${message.author.id}`)
      if(!flensis) flensis = 0
      message.reply("You have " + flensis + " Friedberger-Punkte")
    } else if(args[0] == "get") {
      let user = message.mentions.users.first()
      if(!user) return message.channel.send(new error("You must specify a user!"))
      let flensis = await db.get(`fried_${user.id}`)
      if(!flensis) flensis = 0
      message.channel.send(user.username + " has " + flensis + " Friedberger-Punkte")
    } else if(args[0] == "add") {
      if(message.author.id != config.owner1id) return message.channel.send(new error("Nice try <@426068926607392768>"))
      let user = message.mentions.users.first()
      if(!user) return message.channel.send(new error("You must specify a user!"))
      let flensis = parseInt(await db.get(`fried_${user.id}`))
      if(!flensis) flensis = 0
      let _flensis = parseInt(args[2])
      if(isNaN(_flensis)) return message.channel.send(new error("You must specify a number!"))
      _flensis = flensis+_flensis
      db.set(`fried_${user.id}`, _flensis)
      message.channel.send(user.username + " has " + _flensis + " Friedberger-Punkte now") 
    } else if(args[0] == "remove") {
      if(message.author.id != config.owner1id) return message.channel.send(new error("Nice try <@426068926607392768>"))
      let user = message.mentions.users.first()
      if(!user) return message.channel.send(new error("You must specify a user!"))
      let flensis = parseInt(await db.get(`fried_${user.id}`))
      if(!flensis) flensis = 0
      let _flensis = parseInt(args[2])
      if(isNaN(_flensis)) return message.channel.send(new error("You must specify a number!"))
      _flensis = flensis-_flensis
      db.set(`fried_${user.id}`, _flensis)
      message.channel.send(user.username + " has " + _flensis + " Friedberger-Punkte now") 
    } else if(args[0] == "set") {
      if(message.author.id != config.owner1id) return message.channel.send(new error("Nice try <@426068926607392768>"))
      let user = message.mentions.users.first()
      if(!user) return message.channel.send(new error("Du musst einen User angeben!"))
      let flensis = parseInt(args[2])
      if(isNaN(flensis)) return message.channel.send(new error("You must specify a user!"))
      db.set(`fried_${user.id}`, flensis)
      message.channel.send(user.username + " has " + flensis + " Friedberger-Punkte now") 
    }
  }
}
