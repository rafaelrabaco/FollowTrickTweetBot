import * as dotenv from "dotenv";
import { Bot } from "./Bot";
dotenv.config();

const packageJson = require('../package.json');
console.log(`FollowTrickTweetBot v${packageJson.version}`);
console.log('INFO - Starting bot...');

const server: Bot = new Bot();
server.run();