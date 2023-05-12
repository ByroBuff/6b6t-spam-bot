const mineflayer = require('mineflayer');
const fs = require('fs');

let config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

let botArgs = {
    host: 'anarchy.6b6t.org',
    version: '1.18.1'
};

let running = true;
let name;

const color = {
    // text color codes
    "black": "\x1b[30m",
    "red": "\x1b[31m",
    "green": "\x1b[32m",
    "yellow": "\x1b[33m",
    "blue": "\x1b[34m",
    "magenta": "\x1b[35m",
    "cyan": "\x1b[36m",
    "white": "\x1b[37m",
    "reset": "\x1b[0m",
    // light text color codes
    "lightblack": "\x1b[90m",
    "lightred": "\x1b[91m",
    "lightgreen": "\x1b[92m",
    "lightyellow": "\x1b[93m",
    "lightblue": "\x1b[94m",
    "lightmagenta": "\x1b[95m",
    "lightcyan": "\x1b[96m",
    "lightwhite": "\x1b[97m",
};

class MCBot {

    // Constructor
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.host = botArgs["host"];
        this.version = botArgs["version"];

        this.initBot();
    }

    // Init bot instance
    initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "version": this.version
        });

        this.initEvents()
    }

    createMessage() {
        // Example message function
        let x = Math.floor(Math.random() * 30000000);
        let z = Math.floor(Math.random() * 30000000);
        let baseNum = Math.floor(Math.random() * 283);
        let message = `Base #${baseNum}: ${x} ${z}. You are welcome.`

        return message;
    }

    // Init bot events
    initEvents() {
        this.bot.on("kicked", (reason) => {
            reason = JSON.parse(reason)["text"];
            console.log(`[${color["lightblue"]}${this.username}${color["reset"]}] ${color["lightred"]}${reason}${color["reset"]}`);
            setTimeout(() => {
                this.initBot();
            }, 5000);
        });

        this.bot.on("error", (err) => {
            console.log(`[${color["lightblue"]}${this.username}${color["reset"]}] ${color["red"]}${err}${color["reset"]}`);
            setTimeout(() => {
                this.initBot();
            }, 5000);
        });

        this.bot.once("login", async () => {
            await this.bot.waitForTicks(40);
            this.bot.chat("/login " + this.password);
            
            console.log(`[${color["lightblue"]}${this.username}${color["reset"]}] ${color["lightgreen"]}online${color["reset"]}`);
            await this.bot.waitForTicks(100);
            while (running) {
            
                let blacklist = config["blacklist"];
                let whitelist = config["whitelist"];
                let players;

                if (whitelist.length > 0) {
                    players = whitelist;
                } else if (blacklist.length > 0) {
                    players = Object.keys(this.bot.players);
                    // Filter out blacklisted players
                    players = players.filter((player) => {
                        return !blacklist.includes(player);
                    });
                } else {
                    players = Object.keys(this.bot.players);
                }
                
                let sender = this.username;
                let target = players[Math.floor(Math.random() * players.length)];
                let message;
                if (config["messages"] != []) {
                    message = this.createMessage()
                } else {
                    message = config["messages"][Math.floor(Math.random() * config["messages"].length)];
                }
                
                this.bot.chat(`/msg ${target} ${message}`);
                console.log(`[${color["lightblue"]}${sender}${color["reset"]}] ${color["lightgreen"]}sent${color["reset"]} ${color["yellow"]}${target}${color["reset"]} ${color["lightblack"]}${message}${color["reset"]}`)
                await this.bot.waitForTicks(config["delay"] * 20);
            }
    });
    }
}
var bots = []

for (let i = 0; i < config["usernames"].length; i++) {
    bots.push(new MCBot(config["usernames"][i], config["passwords"][i]));
}