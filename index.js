var TelegramBot = require('node-telegram-bot-api');
var Monitor = require('ping-monitor');

var token = '#########################';
var heimdallBot = new TelegramBot(token, {polling: true});

var siteStash = new Array();


function heimdallSite(website, telegramId) {

	heimdall = this;

	this.telegramId = telegramId;
	this.website = website;
	
	this.monitor = new Monitor({
		website: heimdall.website,
		interval: 10
	});

	this.monitor.on('up', function (response) {
		heimdallBot.sendMessage(heimdall.telegramId,'Everything great @ ' + response.website);
	})

	this.monitor.on('down', function (response) {
		heimdallBot.sendMessage(heimdall.telegramId, 'Website: ' + response.website + ' is down! ' + response.statusMessage);
	});

	this.monitor.on('error', function (response) {
    	heimdallBot.sendMessage(heimdall.telegramId,'Oh Snap!! An unexpected error occured trying to load ' + response.website + '!');
    	heimdall.monitor.stop();
	});

	console.log(heimdall.website + ' ' + heimdall.telegramId);

};

heimdallBot.on('text', function (msg) {
	var chatId = msg.chat.id;
	var message = msg.text;

	if(message.indexOf('/addWebsite ') > -1) {
		message = message.replace('/addWebsite ', '');

		if(!(chatId in siteStash))
			siteStash['a' + chatId] = new Array();

		siteStash['a' + chatId][message] = new heimdallSite(message, chatId);
	}

	if(message.indexOf('/removeWebsite ') > -1) {
		message = message.replace('/removeWebsite ', '');
		heimdallBot.sendMessage(chatId,'Removing ' + message);

		if(('a' + chatId in siteStash) && (message in siteStash['a' + chatId])) {
			siteStash['a' + chatId][message].monitor.stop();
			delete siteStash['a' + chatId][message];
		}
			

	}

});