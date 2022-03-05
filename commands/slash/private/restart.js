const discord = require("discord.js")
const error = require('../../../util/error.js')
const _prefix = require('../../../util/prefix.js')

module.exports = {
  name: "restart",
  category: "",
  description: "",
  usage: "",
  aliases: [""],
  noPerms: false,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    if(message.author.id != config.owner1id && message.author.id != config.owner2id && message.author.id != config.owner3id && message.author.id != config.owner4id) return message.channel.send(new error("This command is only for the owner of this bot"))
    message.channel.send("Restarting...")
    setTimeout(function () {
        process.on("exit", function () {

            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached : true,
                stdio: "inherit"
            });
        });
        process.exit();
    }, 1000);
  }
}