"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
var Bot_1 = require("./Bot");
dotenv.config();
var packageJson = require('../package.json');
console.log("FollowTrickTweetBot v" + packageJson.version);
console.log('INFO - Starting bot...');
var server = new Bot_1.Bot();
server.run();
