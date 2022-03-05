const discord = require("discord.js")
const _prefix = require('../util/prefix.js')

class guildMemberRemove {
  static async event(member, db, config, client) {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, member.guild.id)
    let pl = require('../plugins/welcomer.json')
    if(await db.get(pl.id.replace("%id%", member.guild.id)) != "on") return
    let msg = await db.get(`leavemsg_${member.guild.id}`)
    let chx = client.channels.cache.get(await db.get(`leavechannel_${member.guild.id}`))
    if(await db.get(`welhook_${member.guild.id}`) == "true") chx = new discord.WebhookClient(await db.get(`welhookid_${member.guild.id}`), await db.get(`welhooktoken_${member.guild.id}`));
    if(!msg || !chx) return
    let embed = new discord.MessageEmbed() 
    .setAuthor(member.user.username, member.user.avatarURL())
    .setColor(color)
    .setThumbnail(member.user.avatarURL())
    .setTitle(msg.replace(/%username%/g, member.user.username))
    .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
    chx.send(embed)
    try {
      db.get(`memscorechan_${member.guild.id}`).then(memsb => {
        if(memsb !== null) {
          let channel = client.channels.cache.get(memsb)
          channel.edit({ name: `Members: ${channel.guild.memberCount}` })
        }
      });
    } catch {}
    db.get(`byedm_${member.guild.id}`).then(byedm => {

    });
  }
}

module.exports = guildMemberRemove