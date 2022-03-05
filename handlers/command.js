const { readdirSync } = require("fs");
const discord = require("discord.js");
const ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Commands", "Status");

module.exports = (client) => {
  let commands = []
  readdirSync("./commands/slash/").forEach(async dir => {
    const commandFiles = readdirSync(`./commands/slash/${dir}/`).filter(file => file.endsWith(".js"));
    for (let file of commandFiles) {
      let pull = require(`../commands/slash/${dir}/${file}`);
      if (pull.info && pull.info.name) {
        client.commands.set(pull.info.name, pull);
        table.addRow(file, '✅');
      } else {
        table.addRow(file, `❌  -> No command name specified`);
        continue;
      }
      commands.push(pull.info)
    }
  });
  client.application.commands.set(commands)//.then(x => console.log(x))
  console.log(table.toString());
}
