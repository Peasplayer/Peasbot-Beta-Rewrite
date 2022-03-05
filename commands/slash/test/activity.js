const discord = require("discord.js")

const error = require('../../../util/error.js')
const prefix = require('../../../util/prefix.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
    info: {
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
                        "name": "Chess in the Park",
                        "value": "chess"
                    }
                ]
            }
        ]
    },
    run: async (client, interaction) => {
        let color = config.color
        let footer = config.footer.replace("%prefix%", prefix)

        let channel = interaction.options.getChannel("channel")
        let activity = interaction.options.getString("activity")

        if (!channel.isVoice()) return interaction.reply({ content: "You have to specify a voice channel", ephemeral: true })

        let invite = await client.discordTogether.createTogetherCode(channel.id, activity)

        interaction.reply(`Click this link to start the activity: ${invite.code}`)
    }
}
