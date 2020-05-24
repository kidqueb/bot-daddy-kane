const { readdirSync } = require('fs');
const tmi = require('tmi.js');

const config = require('./config.json');

/**
 * Create an object containing all of our commands
 * from the `./commands` directory.
 */
let COMMANDS = {}
readdirSync(__dirname + '/commands').forEach(file => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    COMMANDS[`!${name}`] = require('./commands/' + file);
  }
});

/**
 * Setup and intialize irc client
 */
const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true,
		secure: true,
	},
	identity: {
		username: config.username,
		password: config.password,
	},
	channels: [config.channel],
});

// bind our events
client.on('join', (channel, username, self) => {
	if (self) client.say(channel, "Pushers don't pay taxes.");
});

client.on('message', (channel, userstate, message, self) => {
  if (self) return;

	const [name, ...params] = message.trim().split(' ');
  const cmd = COMMANDS[name];

	if (cmd) cmd({
    client,
    params,
    userstate,
    say: msg => client.say(channel, msg)
  });
});

// kick the tires
client.connect();
