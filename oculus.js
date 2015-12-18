var Twit = require('twit');
var twilioKeys = require('./keys/keys').twilioKeys;
var twitterKeys = require('./keys/keys').twitterKeys;
var phoneNumbers = require('./keys/keys').phoneNumbers;
var accountSid = twilioKeys.accountSid;
var authToken = twilioKeys.authToken;
var client = require('twilio')(accountSid, authToken);
var express = require('express');
var app = express()
 
app.get('/', function (req, res) {
  res.send('Oculus Rift Twitter Bot');
});
app.listen(3000);

var T = new Twit({
	consumer_secret: twitterKeys.consumerSecret,
	consumer_key: twitterKeys.consumerKey,
	access_token: twitterKeys.accessToken,
	access_token_secret: twitterKeys.accessTokenSecret
});

var matchingTweet = '';

// user's twitter handle and number of posts to check
var options = { screen_name: 'oculus',
                count: 1 };

// Function to check user's most recent tweet for certain keywords
function getRecentTweets() {
	T.get('statuses/user_timeline', options , function(err, tweet) {
		if (err) {
			console.log(err);
		}
		// T.get returns array of length one, so grab the array item
		var latestTweet = tweet[0];
		console.log(latestTweet.text);

		var tweetCased = latestTweet.text.toLowerCase();

		// If any of these words appear in the tweet, evaluates to true
		if (tweetCased.indexOf('testing') > -1 ||
			tweetCased.indexOf('preorder') > -1 || 
			tweetCased.indexOf('pre-order') > -1 ||
			tweetCased.indexOf('buy') > -1 ||
			tweetCased.indexOf('launch') > -1) {

			// Check if we've seen this tweet before and if so do not execute text message again
			if (latestTweet.text !== matchingTweet) {
				client.messages.create({
					body: latestTweet.text,
					to: phoneNumbers.myNumber,
					from: phoneNumbers.twilioNumber
				}, function(err) {
					console.log(err);
				});
			}
			matchingTweet = latestTweet.text;
		}
	});
};

// Checks user's tweets every 15 seconds for a match
setInterval(getRecentTweets, 15000);





