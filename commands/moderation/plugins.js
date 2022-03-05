const discord = require("discord.js")
const error = require('../../util/error.js')
const _prefix = require('../../util/prefix.js')
const plugins = require('../../plugins/plugins.json').plugins

module.exports = {
  name: "plugins",
  category: "",
  description: "",
  usage: "",
  aliases: ["pl"],
  noPerms: true,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send({ embeds: [new error("You don't have the required permissions!")] })
    if(!args[0]) {
      let embed = new discord.MessageEmbed()
      .setTitle("🧩 Plugins 🧩")
      .setColor(color)
      .setDescription("To manage a plugin, use the command `" + prefix + "plugins (Plugin) (on/off/setup)`")
      .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
      plugins.forEach(key => {
        let pl = require('../../plugins/'+key.key+".json")
        embed.addField(""+pl.name, `\`${key.key}\``, true)
      })
      return message.channel.send({ embeds: [embed] })
    }
    let embed = new discord.MessageEmbed()
    .setTitle("🧩 Plugins 🧩")
    .setColor(color)
    .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
    let matches = false
    plugins.forEach(async (key) => {
      if(args[0] === key.key) matches = true
      if(args[0] === key.key) {
        if(!args[1]) {
          let pl = require('../../plugins/'+key.key+".json")
          embed.setTitle("🧩 "+pl.name+" 🧩")
          embed.setDescription(pl.description)
          if(await db.get(pl.id.replace("%id%", message.guild.id)) == "on") {
            embed.addField("Status", "🟢 active")
          } else {
            embed.addField("Status", "🔴 disabled")
          }
          embed.addField("Settings", "Settings to configure the plugin for this server:")
          pl.settings.forEach(setting => {
            embed.addField("⚙️ "+setting.name, "`"+setting.id+"`")
          })
          message.channel.send({ embeds: [embed] })
        } else if(args[1] === "on") {
          let pl = require('../../plugins/'+key.key+".json")
          if(await db.get(pl.id.replace("%id%", message.guild.id)) == "on") {
            embed.setDescription(`🟢 Plugin \`${pl.name}\` is already active.`)
            message.channel.send({ embeds: [embed] })
          } else {
            db.set(pl.id.replace("%id%", message.guild.id), "on")
            embed.setDescription(`🟢 Plugin \`${pl.name}\` has been activated.`)
            message.channel.send({ embeds: [embed] })
          }
        } else if(args[1] === "off") {
          let pl = require('../../plugins/'+key.key+".json")
          if(await db.get(pl.id.replace("%id%", message.guild.id)) == "off") {
            embed.setDescription(`🔴 Plugin \`${pl.name}\` is already disabled.`)
            message.channel.send({ embeds: [embed] })
          } else {
            db.set(pl.id.replace("%id%", message.guild.id), "off")
            embed.setDescription(`🔴 Plugin \`${pl.name}\` has been disabled.`)
            message.channel.send({ embeds: [embed] })
          }
        } else if(args[1] === "setup") {
          let pl = require('../../plugins/'+key.key+".json")
          db.set(pl.id.replace("%id%", message.guild.id), "on")
          embed.setDescription("The setup will now be started. You can cancel it at any time with `stop` and skip a setting with `skip`.")
          let _msg = await message.channel.send({ embeds: [embed] })
          let filter = m => m.author.id === message.author.id
          let settings = []
          pl.settings.forEach(setting => {
            let _key = require('./settings.json').settings.filter(item => item.key == setting.id)[0]
            settings.push({ name: setting.name, id: setting.id,type: _key.type })
          })
          let values = []
          async function awaitMessage(text, msg) {
            msg.edit({ embeds: [embed.setDescription(text)] })
            message.channel.awaitMessages(filter, {max:1, time: 180000}).then(async res => {
              if(!res.first()) return msg.edit({ embeds: [embed.setDescription("Setup was canceled")] })
              let content = res.first().content
              if(content == "stop") {
                res.first().delete()
                return msg.edit({ embeds: [embed.setDescription("Setup was canceled")] })
              }
              if(content != "skip") {
                let key = require('./settings.json').settings.filter(item => item.key == settings[0].id)[0]
                if(key.type === "string") {
                  db.set(key.id.replace("%id%", message.guild.id), content.split(" ")[0])
                } else if(key.type === "multiString") {
                  db.set(key.id.replace("%id%", message.guild.id), content)
                } else if(key.type === "number") {
                  if(isNaN(content.split(" ")[0])) return msg.edit({ embeds: [new error("You must specify a number! (Setup must be restarted)")] })
                  db.set(key.id.replace("%id%", message.guild.id), content.split(" ")[0])
                } else if(key.type === "boolean") {
                  if(content.toLowerCase() != "true" && content.toLowerCase() != "false") return msg.edit({ embeds: [new error("You must specify either `true` or `false`! (Setup must be restarted)")] })
                  db.set(key.id.replace("%id%", message.guild.id), content)
                } else if(key.type === "channel") {
                  let value = res.first().mentions.channels.first()
                  if(value == null) return msg.edit({ embeds: [new error("You must specify a channel! (Setup must be restarted)")] })
                  db.set(key.id.replace("%id%", message.guild.id), value.id)
                } else if(key.type === "role") {
                  let value = res.first().mentions.roles.first().id
                  if(value == null) return msg.edit({ embeds: [new error("You must specify a role! (Setup must be restarted)")] })
                  db.set(key.id.replace("%id%", message.guild.id), value)
                }
              }
              res.first().delete()
              values.push({ setting: settings[0].name, value: content})
              settings.shift()
              if(settings[0]) {
                awaitMessage("What should `"+settings[0].name+"` be set to?", msg)
              } else {
                embed.setDescription("Setup completed")
                values.forEach(key => {
                  embed.addField(key.setting, key.value)
                })
                msg.edit({ embeds: [embed] })
              }
            })
          }
          setTimeout(async function() {
            awaitMessage("What should `"+settings[0].name+"` be set to?", _msg)
          }, 5000)
        }
      }
    })
    if(matches == false) message.channel.send({ embeds: [new error("This plugin does not exist! To show you a list of plugins, just use the command `"+prefix+"plugins`.")] })
  }
}
