class messageReactionAdd {
  static async event(reaction, user, db) {
    if (user.bot) return;
    let message = reaction.message;
    let member = message.guild.members.cache.find(item => item.id === user.id);
    if (reaction.emoji.name == "✅" && await db.get(`ticketmsg_${message.guild.id}`) == message.id) {
      let pl = require('../plugins/welcomer.json')
      if (await db.get(pl.id.replace("%id%", member.guild.id)) != "on") return
      reaction.users.remove(user);
      require('../commands/moderation/ticket').open(member, db)
    }
    db.get(`rulemessage_${message.guild.id}`).then(rulemessage => {
      db.get(`rulerole_${message.guild.id}`).then(rulerole => {
        if (rulerole && rulemessage) {
          if (message.id == rulemessage && reaction.emoji.name == "✅") {
            member.roles.add(rulerole);
            db.get(`ruleaccepted_${message.guild.id}`).then(text => {
              if (text) {
                member.user.send(text)
              }
            });
          }
        }
      });
    });
    db.get(`selfrolemessage_${message.guild.id}`).then(selfrolemsg => {
      if (selfrolemsg == message.id) {
        db.list("selfrole_").then(matches => {
          matches.forEach(match => {
            db.get(match).then(selfrole => {
              let _emoji = "<:" + reaction.emoji.name + ":" + reaction.emoji.id + ">"
              if (!selfrole) return
              if (!selfrole.emoji) return
              if (selfrole.emoji == _emoji || selfrole.emoji == reaction.emoji.name) {
                member.roles.add(selfrole.role);
              }
            });
          })
        })
      }
    });
  }
}

module.exports = messageReactionAdd