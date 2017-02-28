Slackish
=========

A lightweight module providing the functionality to send messages to Slack.

## Installation
`npm install slackless`

## Usage

### Initialization
```javascript
var slack = require('slackless')('https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX');
```

The URL that you need to input is acquired when setting up *incoming webhooks* for your Slack domain.
<https://YOUR_DOMAIN.slack.com/apps/manage/custom-integrations>

### Set global options
```javascript
slack.setUsername('B0T');
slack.setIcon('ghost');
slack.setChannel('general');
```

### Send message
```javascript
slack.send({
	text: 'Test message.'
});
```

### Send message with attachments
```javascript
slack.send({
	text: 'Test message.',
	attachments: [
        {
            "fallback": "Required plain-text summary of the attachment.",
            "color": "#36a64f",
            "pretext": "Optional text that appears above the attachment block",
            "author_name": "Bobby Tables",
            "author_link": "http://flickr.com/bobby/",
            "author_icon": "http://flickr.com/icons/bobby.jpg",
            "title": "Slack API Documentation",
            "title_link": "https://api.slack.com/",
            "text": "Optional text that appears within the attachment",
            "fields": [
                {
                    "title": "Priority",
                    "value": "High",
                    "short": false
                }
            ],
            "image_url": "http://my-website.com/path/to/image.jpg",
            "thumb_url": "http://example.com/path/to/thumb.png",
            "footer": "Slack API",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
            "ts": 123456789
        }
    ]
});
```

### Override global options when sending the message
```javascript
slack.send({
	text: 'Test message.',
	icon_emoji: 'banana', // Will override the icon set using setIcon().
	username: 'B0T', // Will override the username set using setUsername().
	channel: '#general' // Will override the channel set using setChannel().
});
```

## Tests
`npm test`

## Release History

* `1.0.0` - *2017-02-28* - **Initial release**