const { default_prefix, status, activity, activityType, version, privat, color, footer, footerImg } = require("../config.json")
const discord = require('discord.js')
const log = require('../handlers/log.js')
const editJsonFile = require("edit-json-file");

class ready {
  static async event(client, db) {
    ["command"].forEach(handler => {
      require(`../handlers/${handler}`)(client);
    });

    let date = new Date(Date.now())
    console.log(`Bot ist aktiv:`, date.getDate(), date.getMonth()+1, date.getFullYear(), "-", date.getHours()+1,date.getMinutes())
    console.log("Servers:", client.guilds.cache.size)
    console.log("Users:", client.users.cache.size)
    console.log("Channels:", client.channels.cache.size)
    let file = editJsonFile(`./public/js/stats.json`);
    file.set("servers", client.guilds.cache.size)
    file.set("users", client.users.cache.size)
    file.set("channels", client.channels.cache.size)
    file.save()
    log.login(client)
    /*db.get("private").then(_private => {
      if(_private === "true") {
        client.user.setStatus('dnd');
        client.user.setPresence({ activity: { name: 'Private-Mode' }, status: 'dnd' })
      } else {
        db.get("status").then(_activity => {
          let text = _activity.name;
          if(text.includes("%users%")) text = text.replace(/%users%/g, client.users.cache.size)
          if(text.includes("%channels%")) text = text.replace(/%channels%/g, client.channels.cache.size)
          if(text.includes("%guilds%")) text = text.replace(/%guilds%/g, client.guilds.cache.size)
          _activity.name = text
          if(_activity.type.toUpperCase() == "STREAMING") {
            _activity.name = _activity.name.replace(_activity.url+" ","")
            client.user.setPresence({ activity: _activity, status: 'online' })
          } else {
            client.user.setPresence({ activity: _activity, status: 'online' })
          }
        });
      }
    });*/

    /*client.application.commands.set([
      {
        name: 'activity',
        description: 'Start a voice-channel activity',
        options: [
          {
            name: "channel",
            description: "Which channel do you want to use",
            type: "CHANNEL",
            required: true
          },
          {
            name: "activity",
            description: "Which Activity do you want to use",
            type: "STRING",
            required: true,
            choices: [
              {
                "name": "YouTube-Together",
                "value": "youtube"
              },
              {
                "name": "Poker Night",
                "value": "poker"
              },
              {
                "name": "Betrayl.io",
                "value": "betrayal"
              },
              {
                "name": "Fishington.io",
                "value": "fishing"
              },
              {
                "name": "Chess in the pPark",
                "value": "chess"
              }
            ]
          }
        ]
      }
    ])*/
  }
}

module.exports = ready