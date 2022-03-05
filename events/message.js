const { status, activity, activityType, version, privat, color, owner1id, owner2id } = require("../config.json")
const config = require('../config.json')
const discord = require('discord.js')
const prefix = require('../util/prefix.js')

class message {
  static async event(message, config, db, client) {
    /*if (message.author.bot) return;
    if (!message.guild) {
      message.channel.send(config.error + " This bot can only be used via a server!")
      let embed = new discord.MessageEmbed()
      .setTitle("🤖Bot-Info🤖")
      .setColor(color)
      .setDescription(`The Peasbot is a multifunctional Discord bot, perfect to keep your Discord server running!\n\n❓|**Support**: http://peascord.tk/\n📩|**Bot Invitation**: https://www.peasbot.tk/invite\n\n👤|**Developer & Creator**: <:Peasplayer:782632080776626197> Peasplayerᵈᵉᵛ#0664\n<:YouTube:782633314464694279>|**YouTube**: http://aboniertpeasplayer.tk`)
      .setFooter(config.footer, config.footerImg)
      message.channel.send(embed)
    } else {
      let _prefix = await prefix.getPrefix(db, config, message.guild.id)
    if(message.content.indexOf(_prefix) == 0) {
      if(privat === "true") {
        if(message.author.id === owner1id || message.author.id === owner2id) {
        } else {
          return message.channel.send(config.error + " The bot is currently disabled!")
        }
      }
      if (!message.member) message.member = await message.guild.fetchMember(message);
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase().replace(_prefix, "")
      if (cmd.length === 0) return;
      let command = client.commands.get(cmd);
      if (!command) command = client.commands.get(client.aliases.get(cmd));
      if (command) {
        command.run(client, message, args, config ,db);
        
      }
    } else {
      if(message.content.includes("https://") || message.content.includes("http://") || message.content.includes("www.") || message.content.includes(".com")) {
        if(!message.member.hasPermission("EMBED_LINKS")) {
          message.delete({ timeout: 1000 })
        }
      }
    }
    }*/
  }
}

module.exports = message