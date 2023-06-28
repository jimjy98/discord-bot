import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const TOKEN = "MTEyMzM1NTE0MzQ2Nzk3ODg2Mw.G4ZFxY.QfBqP0UmzWwEktzbhuagTjbvA52dBzzzDF6itg";
const usernamesToDisconnect = ['nicholops'];
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const newMember = newState.member;
    if (usernamesToDisconnect.includes(newMember.user.username)) {
        console.log("disconnecting ", newMember.displayName);
        newMember.voice.disconnect();
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'lgbtq') {
        await interaction.reply('nikizoo ya loooo');
    }
});

client.login(TOKEN);