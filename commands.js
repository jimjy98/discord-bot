import { REST, Routes } from 'discord.js';

const TOKEN = "MTEyMzM1NTE0MzQ2Nzk3ODg2Mw.G4ZFxY.QfBqP0UmzWwEktzbhuagTjbvA52dBzzzDF6itg";
const CLIENT_ID = "1123355143467978863";

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'lgbtq',
        description: 'nikizoo'
    }
];

const rest = new REST({ version: 10 }).setToken(TOKEN);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.log(error);
}