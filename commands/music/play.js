const discord = require("discord.js")
const error = require('../../util/error.js')
const _prefix = require('../../util/prefix.js')
const { DiscordInteractions, ApplicationCommandOptionType } = require("slash-commands");

module.exports = {
  name: "play",
  category: "",
  description: "",
  usage: "",
  aliases: ["p"],
  noPerms: true,
  run: async (client, message, args, config, db) => {
    try {
      let color = config.color
      let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
      if(!message.member.voice.channel) return message.channel.send({ embeds: new error("You must be in a voice channel!") })
      if(!args[0]) return message.channel.send({ embeds: new error("You must specify a song name!") })
      message.channel.send("<:YouTube:806142333602103326> Search for **"+args.join(" ")+"**... 🔎")
      let query = args.join(" ")
      const queue = client.player.createQueue(message.guild, {
            metadata: {
                channel: message.channel,
                message: message
            }
        });
        
        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.destroy();
            return message.channel.send({ content: "Could not join your voice channel!" });
        }

        const track = await client.player.search(query, {
            requestedBy: message.author
        }).then(x => x.tracks[0]);
        
        if (!track) return message.send({ content: `❌ | Track **${query}** not found!` });

        queue.play(track);
    } catch(err) {
      require('../../handlers/log').error(client, err)
    }
    
  },
  slash: {
    name: "play",
    description: "Play a song",
    options: [
      {
        name: "Song",
        description: "The name or the yt-url of teh song you want to play",
        type: ApplicationCommandOptionType.STRING,
        required: true
      }
    ],
    run: async (client, interaction, args, config, db) => {
      try {
        let color = config.color
        let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
        if(!message.member.voice.channel) return message.channel.send({ embeds: new error("You must be in a voice channel!") })
        if(!args[0]) return message.channel.send({ embeds: new error("You must specify a song name!") })
        message.channel.send("<:YouTube:806142333602103326> Search for **"+args.join(" ")+"**... 🔎")
        let query = args.join(" ")
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel:  interaction.channel
            }
        });
        
        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        await interaction.deferReply();
        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

        queue.play(track);
      } catch(err) {
        require('../../handlers/log').error(client, err)
      }
      
    }
  }
}
