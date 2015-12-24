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

var matchingTweets = [];

// Array of twitter handles to check
var usersToCheck = ['oculus', 'PalmerLuckey', 'brendaniribe', 'natemitchell'];

function checkTwitterAccounts() {
	usersToCheck.forEach(function(user, index) {
		// Current user's twitter handle and number of posts to check
		var options = { screen_name: user,
	                count: 1 };
		T.get('statuses/user_timeline', options , function(err, tweet) {
			if (err) {
				console.log(err);
			}

			// T.get returns array of length one, so grab the array item
			var latestTweet = tweet[0];

			var tweetCased = latestTweet.text.toLowerCase();

			// If any of these words appear in the tweet, evaluates to true
			if (tweetCased.indexOf('preorder') > -1 || 
				tweetCased.indexOf('pre-order') > -1 ||
				tweetCased.indexOf('buy') > -1 ||
				tweetCased.indexOf('launch') > -1) {

				// Check if this tweet is already in the array at the twitter user's index
				// so we do not execute text message again
				if (latestTweet.text !== matchingTweets[index]) {
					// If this is a new tweet for the user, set equal to that index in the array
					matchingTweets[index] = latestTweet.text;
					client.messages.create({
						body: latestTweet.text,
						to: phoneNumbers.myNumber,
						from: phoneNumbers.twilioNumber
					}, function(err) {
						console.log(err);
					});
				}
			}
		});
	});
}

// Twitter allows 180 requests in a 15 min window, so interval is 5 sec * number of accounts checked
var refreshInterval = 5000 * usersToCheck.length;

setInterval(checkTwitterAccounts, refreshInterval);






