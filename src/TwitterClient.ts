import Twit from 'twit';

export class TwitterClient {

    public twitter: Twit;

    private consumer_key: any = process.env.TWITTER_CONSUMER_KEY;
    private consumer_secret: any = process.env.TWITTER_CONSUMER_SECRET;
    private access_token_key: any = process.env.TWITTER_ACCESS_TOKEN_KEY;
    private access_token_secret: any = process.env.TWITTER_ACCESS_TOKEN_SECRET;

    constructor() {
        this.twitter = new Twit({
            consumer_key: this.consumer_key,
            consumer_secret: this.consumer_secret,
            access_token: this.access_token_key,
            access_token_secret: this.access_token_secret,
        });
    }

    postTweet(tweet: string) {
        return new Promise((resolve, reject) => {
            this.twitter.post('statuses/update', { 'status': tweet }, (error: any, tweet: any) => {
                if (error)
                    return reject(error);

                return resolve(tweet);
            });
        });
    }

    favoriteCreate(tweet_id: any) {
        return new Promise((resolve, reject) => {
            this.twitter.post('favorites/create', { 'id': tweet_id }, (error: any) => {
                if (error)
                    return reject(error);

                return resolve(true);
            });
        });
    }

    favoriteRemove(tweet_id: any) {
        return new Promise((resolve, reject) => {
            this.twitter.post('favorites/destroy', { 'id': tweet_id }, (error: any) => {
                if (error)
                    return reject(error);

                return resolve(true);
            });
        });
    }
}