"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TwitterClient_1 = require("./TwitterClient");
var fs = __importStar(require("fs"));
var node_schedule_1 = __importDefault(require("node-schedule"));
var Bot = /** @class */ (function () {
    function Bot() {
        this.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.client = new TwitterClient_1.TwitterClient();
        this.emojis = JSON.parse(fs.readFileSync('emojis.json', 'utf8'));
        this.schedules = JSON.parse(fs.readFileSync('schedules.json', 'utf8'));
    }
    Bot.prototype.sendTweetToSchedule = function () {
        var _this = this;
        this.daysOfWeek
            .map(function (dayOfWeek) {
            var scheduleHours = Object.keys(_this.schedules[dayOfWeek]);
            scheduleHours
                .map(function (completeHour) {
                _this.scheduleTweet(_this.daysOfWeek.indexOf(dayOfWeek), completeHour.split(':')[0], completeHour.split(':')[1], _this.schedules[dayOfWeek][completeHour]);
            });
            console.log("SUCCESS - Scheduling " + dayOfWeek + " tweets");
        });
    };
    Bot.prototype.scheduleTweet = function (dayOfWeek, hour, minute, tweet) {
        var _this = this;
        node_schedule_1.default.scheduleJob({
            hour: hour,
            minute: minute,
            dayOfWeek: dayOfWeek
        }, function () {
            console.log("INFO - Sending a tweet scheduled at " + hour + ":" + minute + " on " + _this.daysOfWeek[dayOfWeek] + "...");
            _this.sendTweet(tweet);
        });
    };
    Bot.prototype.sendTweet = function (tweet) {
        var _this = this;
        var randomEmoji = tweet['randomEmoji'] ? this.emojis[Math.floor(Math.random() * this.emojis.length)] : '';
        var tweetText = tweet.text + " " + randomEmoji;
        this.client
            .postTweet(tweetText)
            .then(function (postedTweet) {
            console.log("SUCCESS - Send success! [" + postedTweet['id_str'] + "]");
            if (process.env.AUTO_FAVORITE_TWEET)
                _this.favoriteTweet(postedTweet['id_str']);
        }).catch(function (err) {
            console.log("ERROR - Failed to send. [" + err.message + "]");
        });
    };
    Bot.prototype.favoriteTweet = function (tweet_id) {
        var _this = this;
        setTimeout(function () {
            _this.client
                .favoriteCreate(tweet_id)
                .then(function () {
                console.log("SUCCESS - Favorite create! [" + tweet_id + "]");
            }).catch(function (err) {
                console.log("ERROR - Failed to favorite. [" + err.message + "]");
            });
        }, 20000); // 20 SECONDS
    };
    Bot.prototype.run = function () {
        console.log('SUCCESS - Bot started!');
        this.sendTweetToSchedule();
    };
    return Bot;
}());
exports.Bot = Bot;
