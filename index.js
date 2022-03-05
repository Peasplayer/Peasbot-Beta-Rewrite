 require('dotenv').config();
const discord = require('discord.js')
const client = new discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_PRESENCES', 'DIRECT_MESSAGES', 'GUILD_VOICE_STATES'], partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'] });
const config = require("./config.json")
const log = require('./handlers/log.js')
const Database = require("@replit/database")
const db = require('quick.db')
const { Player } = require("discord-player");
const player = new Player(client);
const { DiscordTogether } = require('discord-together');
client.discordTogether = new DiscordTogether(client);
//events
const ready = require('./events/ready')
const messageEvent = require('./events/message')
const messageReactionAdd = require('./events/messageReactionAdd')
const messageReactionRemove = require('./events/messageReactionRemove')
const guildMemberRemove = require('./events/guildMemberRemove')
const guildMemberAdd = require('./events/guildMemberAdd')
const guildMemberJoinsVoiceChannel = require('./events/guildMemberJoinsVoiceChannel')
const guildMemberLeavesVoiceChannel = require('./events/guildMemberLeavesVoiceChannel')
const interaction = require('./events/interaction')

require('./server.js')(client)
require('./slash.js')(client)

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.player = player;

client.on("ready", () => {
  ready.event(client, db)
});
client.on("messageCreate", async message => {
  messageEvent.event(message, config, db, client);
});

client.on("messageReactionAdd", (reaction, user) => {
  messageReactionAdd.event(reaction, user, db)
})

client.on("messageReactionRemove", (reaction, user) => {
  messageReactionRemove.event(reaction, user, db)
})

client.on("guildMemberAdd", (member) => {
  guildMemberAdd.event(member, db, config, client)
})

client.on("guildMemberRemove", (member) => { 
  guildMemberRemove.event(member, db, config, client)
})

client.on("guildCreate", (guild) => { 
  log.guildJoin(client, guild)
})

client.on("guildDelete", (guild) => { 
  log.guildLeave(client, guild)
})

client.on("error", (error) => { 
  log.error(client, error)
})

client.on("voiceStateUpdate", (oldState, newState) => {
  if(oldState.channel == null) {
    let member = newState.guild.members.cache.get(newState.id)
    let channel = newState.channel
    guildMemberJoinsVoiceChannel.event(member, channel, db)
  }
  if(newState.channel == null) {
    let member = oldState.guild.members.cache.get(oldState.id)
    let channel = oldState.channel
    guildMemberLeavesVoiceChannel.event(member, channel, db)
  }
})

client.on("channelCreate", async (channel) => {
  if(channel.type == "dm") return;
  let roleid = await db.get(`muterole_${channel.guild.id}`)
  let role = null;
  if(channel.guild.roles.cache.get(roleid)) role = channel.guild.roles.cache.get(roleid)
  if(!role) role = await channel.guild.roles.create({data: { name: 'Muted'}});
  role.setPermissions(['VIEW_CHANNEL'])
  db.set(`muterole_${channel.guild.id}`, role.id)
  channel.permissionOverwrites.edit(role, {
    SEND_MESSAGES: false,
    SPEAK: false,
  })
})

client.on('interactionCreate', async int => {
  interaction.event(client, int)
})

require('./player')(client)

client.login(process.env.bot_token)