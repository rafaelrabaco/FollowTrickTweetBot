import { TwitterClient } from "./TwitterClient";
import * as fs from 'fs';
import schedule from "node-schedule";

export class Bot {

    public client: TwitterClient
    public emojis: Array<string>
    public schedules: Array<any>
    public daysOfWeek: Array<any> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    constructor() {
        this.client = new TwitterClient();
        this.emojis = JSON.parse(fs.readFileSync('emojis.json', 'utf8'));
        this.schedules = JSON.parse(fs.readFileSync('schedules.json', 'utf8'));
    }

    sendTweetToSchedule() {
        this.daysOfWeek
            .map((dayOfWeek: any) => {
                let scheduleHours = Object.keys(this.schedules[dayOfWeek]);
                scheduleHours
                    .map((completeHour: string) => {
                        this.scheduleTweet(
                            this.daysOfWeek.indexOf(dayOfWeek),
                            completeHour.split(':')[0],
                            completeHour.split(':')[1],
                            this.schedules[dayOfWeek][completeHour]
                        );
                    });
                console.log(`SUCCESS - Scheduling ${dayOfWeek} tweets`)
            });
    }

    scheduleTweet(dayOfWeek: number, hour: string, minute: string, tweet: Array<any>) {
        schedule.scheduleJob({
            hour: hour,
            minute: minute,
            dayOfWeek: dayOfWeek
        }, () => {
            console.log(`INFO - Sending a tweet scheduled at ${hour}:${minute} on ${this.daysOfWeek[dayOfWeek]}...`)
            this.sendTweet(tweet);
        });
    }

    sendTweet(tweet: any) {
        let randomEmoji = tweet['randomEmoji'] ? this.emojis[Math.floor(Math.random() * this.emojis.length)] : ''
        let tweetText = `${tweet.text} ${randomEmoji}`
        this.client
            .postTweet(tweetText)
            .then((postedTweet: any) => {
                console.log(`SUCCESS - Send success! [${postedTweet['id_str']}]`)
                if (process.env.AUTO_FAVORITE_TWEET)
                    this.favoriteTweet(postedTweet['id_str']);

            }).catch(err => {
                console.log(`ERROR - Failed to send. [${err.message}]`)
            })
    }

    favoriteTweet(tweet_id: any) {
        setTimeout(() => {
            this.client
                .favoriteCreate(tweet_id)
                .then(() => {
                    console.log(`SUCCESS - Favorite create! [${tweet_id}]`)
                }).catch(err => {
                    console.log(`ERROR - Failed to favorite. [${err.message}]`)
                })
        }, 20000) // 20 SECONDS
    }

    run() {
        console.log('SUCCESS - Bot started!');
        this.sendTweetToSchedule();
    }
}