const discord = require('discord.js')

class guildMemberJoinsVoiceChannel {
  static async event(member, channel, db) {
    //Support-Manager
    async function supportManager() {
      /*let pl = require('../plugins/welcomer.json')
      if(await db.get(pl.id.replace("%id%", member.guild.id)) != "on") return
      if(await db.get(`supportwaitvc_${channel.guild.id}`) != channel.id) return
      let chx = await channel.guild.channels.create("Support Room", {type: "GUILD_VOICE", parent: channel.parent})
      chx.permissionOverwrites.create(member.guild.roles.everyone, {
        VIEW_CHANNEL: false
      })
      member.voice.setChannel(chx)
      db.get(`supportvcs_${member.guild.id}`).then(supvcs => {
        let _supvcs = []
        if(!supvcs) {
          _supvcs.push({channel: chx.id, user: member.user.id})
        } else {
          _supvcs = supvcs
          _supvcs.push({channel: chx.id, user: member.user.id})
        }
        db.set(`supportvcs_${member.guild.id}`, _supvcs)
      })
      let log = member.guild.channels.cache.get(await db.get(`supportlog_${member.guild.id}`))
      if(!log) return
      log.send(`<@${member.user.id}> has created a support channel.`)*/
    }
    supportManager()
  }
}

module.exports = guildMemberJoinsVoiceChannel