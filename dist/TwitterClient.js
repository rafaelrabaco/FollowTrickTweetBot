"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var twit_1 = __importDefault(require("twit"));
var TwitterClient = /** @class */ (function () {
    function TwitterClient() {
        this.consumer_key = process.env.TWITTER_CONSUMER_KEY;
        this.consumer_secret = process.env.TWITTER_CONSUMER_SECRET;
        this.access_token_key = process.env.TWITTER_ACCESS_TOKEN_KEY;
        this.access_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
        this.twitter = new twit_1.default({
            consumer_key: this.consumer_key,
            consumer_secret: this.consumer_secret,
            access_token: this.access_token_key,
            access_token_secret: this.access_token_secret,
        });
    }
    TwitterClient.prototype.postTweet = function (tweet) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.twitter.post('statuses/update', { 'status': tweet }, function (error, tweet) {
                if (error)
                    return reject(error);
                return resolve(tweet);
            });
        });
    };
    TwitterClient.prototype.favoriteCreate = function (tweet_id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.twitter.post('favorites/create', { 'id': tweet_id }, function (error) {
                if (error)
                    return reject(error);
                return resolve(true);
            });
        });
    };
    TwitterClient.prototype.favoriteRemove = function (tweet_id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.twitter.post('favorites/destroy', { 'id': tweet_id }, function (error) {
                if (error)
                    return reject(error);
                return resolve(true);
            });
        });
    };
    return TwitterClient;
}());
exports.TwitterClient = TwitterClient;
