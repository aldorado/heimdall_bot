var TelegramBot = require('node-telegram-bot-api');
var Monitor = require('ping-monitor');

var token = '160239739:AAHpwQXEMQfzv-ucr4q80ffbFtd_3cAiwME';
var heimdallBot = new TelegramBot(token, {polling: true});

var siteStash = new Array();


function heimdallSite(website, telegramId) {

	heimdall = this;

	this.telegramId = telegramId;
	this.website = website;
	
	this.monitor = new Monitor({
		website: heimdall.website,
		interval: 1
	});

	this.monitor.on('up', function (response) {
		console.log('Alles knorke auf ' + response.website);
	})

	this.monitor.on('down', function (response) {
		heimdallBot.sendMessage(heimdall.telegramId, 'Website: ' + response.website + ' is down! ' + response.statusMessage);
	});

	this.monitor.on('error', function (response) {
    	console.log('Oh Snap!! An unexpected error occured trying to load ' + response.website + '!');
    	heimdall.monitor.stop();
	});

	console.log(heimdall.website + ' ' + heimdall.telegramId);

};

heimdallBot.on('text', function (msg) {
	var chatId = msg.chat.id;
	var message = msg.text;

	if(message.indexOf('/addWebsite ') > -1) {
		message = message.replace('/addWebsite ', '');
		console.log(message);

		if(!(chatId in siteStash))
			siteStash['a' + chatId] = new Array();

		siteStash['a' + chatId][message] = new heimdallSite(message, chatId);
	}

	if(message.indexOf('/removeWebsite ') > -1) {
		message = message.replace('/removeWebsite ', '');
		console.log('Removing ' + message);

		if(('a' + chatId in siteStash) && (message in siteStash['a' + chatId])) {
			siteStash['a' + chatId][message].monitor.stop();
			delete siteStash['a' + chatId][message];
		}
			

	}

	if(message.indexOf('/testoida') > -1) {
		console.log(siteStash['a24705017']);
	}

});