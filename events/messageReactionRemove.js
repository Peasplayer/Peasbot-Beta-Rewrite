class messageReactionRemove {
  static event(reaction, user, db) {
    if(user.bot) return;
    let message = reaction.message;
    let member = message.guild.members.cache.find(item => item.id === user.id);
    db.get(`rulemessage_${message.guild.id}`).then(rulemessage => {
      db.get(`rulerole_${message.guild.id}`).then(rulerole => {
        if(rulerole && rulemessage) {
          if(message.id == rulemessage && reaction.emoji.name == "✅") {
            member.roles.remove(rulerole);
            db.get(`ruleaccepted_${message.guild.id}`).then(text => {
              if(text) {
                member.user.send(text)
              }
            });
          }
        }
      });
    });
    db.get(`selfrolemessage_${message.guild.id}`).then(selfrolemsg => {
      if(selfrolemsg == message.id) {
        db.list("selfrole_").then(matches => {
          matches.forEach(match => {
            db.get(match).then(selfrole => {
              let _emoji = "<:" + reaction.emoji.name + ":" + reaction.emoji.id + ">"
              if(!selfrole) return
              if(!selfrole.emoji) return
              if(selfrole.emoji == _emoji || selfrole.emoji == reaction.emoji.name) {
                member.roles.remove(selfrole.role);
              }
            });
          })
        })
      }
    });
  }
}

module.exports = messageReactionRemove