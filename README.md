# Discord bot
## Configuration
Add a `.env` file in the root of the project with the following variables:
- `CLIENT_ID` - Discord API client ID 
- `TOKEN` - Discord API token
- `MAX_DOWNLOAD` - The max download size in bytes for the audio file
- `BLACKLIST` - A list of usernames separated with whitespace of the users that you want to have disconnected the second they join a voice channel

## How to Run
Before doing anything, you need to create a Discord App via the Discord Developer portal [here](https://discord.com/developers/applications). 
After creating the app, you can following these steps to get it installed onto your server:
- Navigate to OAuth2
- Select the `bot` scope
- Select the permissions you want the bot to have on your server (I would go with Administrator if you don't want to spend too much time here).
- Copy the generated URL and paste it in your browser to install the bot
Run the following commands to install the packages you need and run the root file
- `npm i`
- `node bot.js`
I had this running in an ec2 instance on AWS because it was easy to SSH and edit the blacklist and audio files, but you can host it wherever you want.

## Tips
To easily update your code while the bot is running, I would fork this repo and clone it in some server you want the app to run in, and create a quick script locally that will run the commands:
- `ctrl+c` to stop the server
- `git pull` to update the repo
- `npm i` if there is an update to `package.json`
- `node bot` to run the server again
after ssh-ing to the server. 
