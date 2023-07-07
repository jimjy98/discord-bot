import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } from '@discordjs/voice';
import * as fs from "fs";
import axios from "axios";
import introMapping from "./introMapping.json" assert { type: "json" };

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
const TOKEN = process.env.TOKEN;
const usernamesToDisconnect = process.env.BLACKLIST.split(' ');
const prefix = '!';

const currentIntroMapping = introMapping;
var isReady = true;

function playAudio(chID, guID, adpID, audioFile) {
    isReady = false;
    const connection = joinVoiceChannel({
        channelId: chID,
        guildId: guID,
        adapterCreator: adpID,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);
    let resource;
    try {
        resource = createAudioResource(audioFile);
    } catch (error) {
        console.log(error);
        resource = createAudioResource("./fail.mp3");
    }
    player.play(resource);
    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
    });

    isReady = true;
}

async function downloadAudioFile(path, url) {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        let downloadSize = parseInt(response.headers['content-length']);
        if (downloadSize > 27000) {
            throw new Error('Download size exceeds the maximum allowed limit');
        }

        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}

async function addIntroAudio(username, audioLink) {
    try {
        await downloadAudioFile(`${username}.mp3`, audioLink);
        currentIntroMapping[username] = `${username}.mp3`;
        fs.writeFileSync('./introMapping.json', JSON.stringify(currentIntroMapping));
        console.log("added to intros", username, audioLink);
        return ("Added intro for " + username);
    } catch (error) {
        return error.message;
    }
}

function deleteIntro(username) {
    try {
        delete currentIntroMapping[username];
        fs.writeFileSync('./introMapping.json', JSON.stringify(currentIntroMapping));
        console.log("deleted from intros", username);
        return ("Removed intro for " + username);
    } catch (err) {
        return error;
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const newMember = newState.member;
    const newMemberUsername = newMember.user.username;
    if (usernamesToDisconnect.includes(newMemberUsername)) {
        console.log("disconnecting ", newMember.displayName);
        newMember.voice.disconnect();
    }
    if (newMemberUsername !== 'Nicholops' && currentIntroMapping.hasOwnProperty(newMemberUsername)) {
        console.log("playing audio for ", newMemberUsername);
        playAudio(newState.channelId, newState.guild.id, newState.guild.voiceAdapterCreator, currentIntroMapping[newMemberUsername]);
    }
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const channel = message.channel;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    const username = message.member.user.username;
    switch (command) {
        case "add-intro":
            const resp = await addIntroAudio(username, args[0]);
            channel.send(resp);
            break;
        case "delete-intro":
            channel.send(deleteIntro(username));
            break;
        default:
            break;
    }
});

client.login(TOKEN);