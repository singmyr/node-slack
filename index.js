/**
 * Possible values in the request to Slack:
 * - text: string
 * - username: string
 * - icon_emoji: string
 * - channel: string
 * - attachments: array (https://api.slack.com/docs/message-attachments)
 *  -> "fallback": "Required plain-text summary of the attachment.",
 *  -> "color": "#36a64f",
 *  -> "pretext": "Optional text that appears above the attachment block",
 *  -> "author_name": "Bobby Tables",
 *  -> "author_link": "http://flickr.com/bobby/",
 *  -> "author_icon": "http://flickr.com/icons/bobby.jpg",
 *  -> "title": "Slack API Documentation",
 *  -> "title_link": "https://api.slack.com/",
 *  -> "text": "Optional text that appears within the attachment",
 *  -> "fields": [
		{
			"title": "Priority",
			"value": "High",
			"short": false
		}
	],
 *  -> "image_url": "http://my-website.com/path/to/image.jpg",
 *  -> "thumb_url": "http://example.com/path/to/thumb.png",
 *  -> "footer": "Slack API",
 *  -> "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
 *  -> "ts": 123456789
 * 
 * TODO:
 * - Common errors you may encounter include:
 *  -> invalid_payload: typically indicates that received request is malformed — perhaps the JSON is structured incorrectly, or the message text is not properly escaped. The request should not be retried without correction.
 *  -> user_not_found:  and channel_not_found indicate that the user or channel being addressed either do not exist or are invalid. The request should not be retried without modification or until the indicated user or channel is set up.
 *  -> channel_is_archived: indicates the specified channel has been archived and is no longer accepting new messages.
 *  -> action_prohibited: usually means that a team admin has placed some kind of restriction on this avenue of posting messages and that, at least for now, the request should not be attempted again.
 *  -> posting_to_general_channel_denied: is thrown when an incoming webhook attempts to post to the "#general" channel for a team where posting to that channel is 1) restricted and 2) the creator of the same incoming webhook is not authorized to post there. You'll receive this error with a HTTP 403.
 *  -> too_many_attachments: is thrown when an incoming webhook attempts to post a message with greater than 100 attachments. A message can have a maximum of 100 attachments associated with it.
 */

var http = require('https');

var _host = 'hooks.slack.com';
var _path = null;

var _headers = {
	'User-Agent': 'Singmyr/Node-Slackless @ 1.0.1',
	'Content-Type': 'application/json'
};

var _username = null;
var _icon_emoji = null;
var _link_names = true;
var _channel = null;

var slack = {
	text: null,
	attachments: []
};

slack.disableLinkNames = function() { _link_names = false; }
slack.enableLinkNames = function() { _link_names = true; }

slack.setIcon = function(icon_emoji) {
	// todo: Strip white spaces and :.
	_icon_emoji = icon_emoji;
}

slack.setUsername = function (username) {
	_username = username;
}

slack.setChannel = function(channel) {
	_channel = channel;
}

slack.send = function(data) {
	// Check if both _url and _path has valid values.
	if(!_host || !_path) {
		throw Error('Missing URL.');
	}

	// Define the body for the request.
	var body = {
		link_names: _link_names
	};

	// Set the global options.
	if(_username !== null) {
		body.username = _username;
	}

	if(_icon_emoji !== null) {
		body.icon_emoji = ':'+_icon_emoji+':';
	}

	if(_channel !== null) {
		body.channel = _channel;
	}

	// If data is a string, assume it's only text.
	if(typeof data === 'string') {
		if(data.length === 0) {
			throw Error('String cannot be empty.');
		}

		body.text = data;
	} else if(data && typeof data === 'object' && data.constructor === Object) {
		// It's an object! Lets see what we got.

		// Check to see if the object actually contains anything.
		if(!Object.keys(data).length) {
			throw Error('Object cannot be empty.');
		}
		
		// Set the text if it was provided.
		if(data.text !== undefined) {
			body.text = data.text;
		}

		// Override the global settings if it was set in data.
		if(data.username !== undefined) {
			body.username = data.username;
		}

		if(data.icon_emoji !== undefined) {
			// todo: Strip white spaces and :.
			body.icon_emoji = ':'+data.icon_emoji+':';
		}

		if(data.channel !== undefined) {
			body.channel = data.channel;
		}

		if(data.attachments !== undefined) {
			body.attachments = data.attachments;
		}
	} else {
		throw Error('Invalid type on data. Must be either object or string.');
	}

	// Turn the body into JSON.
	var json = JSON.stringify(body);

	// Update the Content-Length for this request.
	_headers['Content-Length'] = Buffer.byteLength(json);

	// Set the options for the POST request.
	var options = {
		host: _host,
		path: _path,
		port: '443',
		method: 'POST',
		headers: _headers
	};

	// Create the request.
	var request = http.request(options);

	// Attach a callback function for when we get a response.
	request.on('response', function (response) {
		if(response.statusCode === 200) {
			// Everything went fine!
		}

		//console.log('STATUS: ' + response.statusCode);
		//console.log('HEADERS: ' + JSON.stringify(response.headers));
		/*response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});*/
	});

	request.on('error', function(error) {
		console.error(error);
	});

	request.end(json);

	return true;
}

function setURL(url) {
	// Check what type of variable url is.
	if(typeof url === 'string') {
		// Extract the last 3 parameters of the URL.
		var c = /.*\/([^\/]+)\/([^\/]+)\/(.+)$/.exec(url);
		if(c) {
			if(c[1].length !== 9 || c[2].length !== 9 || c[3].length !== 24) {
				return false;
			}
			_path = '/services/'+c[1]+'/'+c[2]+'/'+c[3];

			return true;
		}
	}

	return false;
}

module.exports = function(url) {
	if(url === undefined || url === null) {
		// Check if we can find an URL in the environment files.
		throw Error('URL is required.');
	}

	if(!setURL(url)) {
		throw Error('Invalid URL.');
	}

	return slack;
};