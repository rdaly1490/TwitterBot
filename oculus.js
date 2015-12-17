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

var matchingTweet;

// maybe put inside a while loop and check to end if a variable becomes true then stop

// also need to check if true tweet === previously seen tweet and not send another text

// user's twitter handle and number of posts to check
var options = { screen_name: 'dalywebdev',
                count: 3 };

// Function to check user's previous 3 tweets for certain keywords
function getRecentTweets() {
	T.get('statuses/user_timeline', options , function(err, data) {
		if (err) {
			console.log(err);
		}
		data.forEach(function(tweet) {
			//make tweets lowercase to check for equality easier
			var tweetCased = tweet.text.toLowerCase();
			// If any of these words appear evaluates to true
			if (tweetCased.indexOf('testing') > -1 ||
				tweetCased.indexOf('preorder') > -1 || 
				tweetCased.indexOf('pre-order') > -1 ||
				tweetCased.indexOf('buy') > -1 ||
				tweetCased.indexOf('launch') > -1) {

				console.log(tweet);
				client.messages.create({
					body: tweet.text,
					to: phoneNumbers.myNumber,
					from: phoneNumbers.twilioNumber
				}, function(err) {
					console.log(err);
				});
			}
		});
		console.log('------------');
	});
};

getRecentTweets();

// Checks user's tweets every 5 minutes for a match
// setInterval(getRecentTweets, 1000 * 60 * 5);





