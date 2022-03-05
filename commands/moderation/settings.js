const discord = require("discord.js")
const settings = require('./settings.json')
const error = require('../../util/error.js')
const _prefix = require('../../util/prefix.js')

module.exports = {
  name: "settings",
  category: "",
  description: "",
  usage: "",
  aliases: ["set"],
  noPerms: true,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send({ embeds: [new error("You don't have the required permissions!")] })
    if(!args[0]) {
      let embed = new discord.MessageEmbed()
      .setTitle("⚙️ Settings ⚙️")
      .setColor(color)
      .setDescription("To change a setting, use the command `" + prefix + "settings (setting) (setting value)`")
      .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
      settings.settings.forEach(key => {
        if(key.type == "string") {
          embed.addField("🔤"+key.name, `\`${key.key}\``, true)
        } else if(key.type == "multiString") {
          embed.addField("📃"+key.name, `\`${key.key}\``, true)
        } else if(key.type == "number") {
          embed.addField("🔢"+key.name, `\`${key.key}\``, true)
        } else if(key.type == "boolean") {
          embed.addField("✅/❌"+key.name, `\`${key.key}\``, true)
        } else if(key.type == "channel") {
          embed.addField("<:Channel:782927323178729502>"+key.name, `\`${key.key}\``, true)
        } else if(key.type == "role") {
          embed.addField("<:Rolle:782925898444832819>"+key.name, `\`${key.key}\``, true)  
        }
      })
      return message.channel.send({ embeds: [embed] })
    }
    let embed = new  discord.MessageEmbed()
    .setTitle("⚙️ Settings ⚙️")
    .setColor(color)
    .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
    let matches = false
    settings.settings.forEach(key => {
      if(args[0] === key.key) matches = true
      if(args[0] === key.key) {
        if(!args[1]) {
          db.get(key.id.replace("%id%", message.guild.id)).then(value => {
            let _value = value
            if(!value) _value = "<Not set up>"
            embed.setTitle("⚙️ Settings ⚙️ - " + key.name)
            embed.setDescription(`Current setting:\n\`\`\`${_value}\`\`\``)
            message.channel.send({ embeds: [embed] })
          });
        } else if(key.type === "string") {
          let value = args[1] + ""
          db.set(key.id.replace("%id%", message.guild.id), value)
          embed.setDescription(`Settings have been changed:\n\`\`\`${key.name} has been set to ${value}.\`\`\``)
          message.channel.send({ embeds: [embed] })
        } else if(key.type === "multiString") {
          let value = args.slice(1).join(' ')
          db.set(key.id.replace("%id%", message.guild.id), value)
          embed.setDescription(`Settings have been changed:\n\`\`\`${key.name} has been set to ${value}.\`\`\``)
          message.channel.send({ embeds: [embed] })
        } else if(key.type === "number") {
          let value = args[1]
          if(isNaN(value)) return message.channel.send(new error("You must specify a number!"))
          db.set(key.id.replace("%id%", message.guild.id), value)
          embed.setDescription(`Settings have been changed:\n\`\`\`${key.name} has been set to ${value}.\`\`\``)
          message.channel.send({ embeds: [embed] })
        } else if(key.type === "boolean") {
          let value = args[1]
          if(value != "true" && value != "false") return message.channel.send(new error("You must use either `true` or `false`!"))
          db.set(key.id.replace("%id%", message.guild.id), value)
          embed.setDescription(`Settings have been changed:\n\`\`\`${key.name} has been set to ${value}.\`\`\``)
          message.channel.send({ embeds: [embed] })
        } else if(key.type === "channel") {
          let value = message.mentions.channels.first()
          if(value == null) return message.channel.send(new error("You must specify a channel!"))
          db.set(key.id.replace("%id%", message.guild.id), value.id)
          embed.setDescription(`Settings have been changed:\n\`\`\`${key.name} has been set to ${value}.\`\`\``)
          message.channel.send({ embeds: [embed] })
        } else if(key.type === "role") {
          let value = message.mentions.roles.first().id
          if(value == null) return message.channel.send(new error("DYou must specify a role!"))
          db.set(key.id.replace("%id%", message.guild.id), value)
          embed.setDescription(`Settings have been changed:\n\`\`\`${key.name} has been set to ${value}.\`\`\``)
          message.channel.send({ embeds: [embed] })
        }
      }
    })
    if(matches == false) message.channel.send({ embeds: [new error("This setting does not exist! To display a list of settings, simply use the command `settings`.")] })
  }
}