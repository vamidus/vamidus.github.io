var Main = function () {
	// Variables
	this.intervalHandle = null;

	// Selectors
	this.$container = null;
};

Main.prototype = {
	initialize: function (settings) {
		if (settings) this.applySettings(settings);
		this.setup();
	},

	applySettings: function (settings) {
		$.extend(this, settings);
	},

	setup: function () {
		this.setupElementSelectors();
		this.setupIntervalHandler();
	},

	setupElementSelectors: function () {
		this.$container = $("div.container");
	},

	setupIntervalHandler: function () {
		var me = this;
		if (me.intervalHandle != null) {
			clearInterval(me.intervalHandle);
		}
		me.intervalHandle = setInterval(me.clockIntervalHandler.bind(me), 1000);
	},

	clockIntervalHandler: function (e) {
		var me = this;
		var t = new Date();
		var hh = t.getHours() ? "0" + t.getHours() : t.getHours();
		var mm = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
		var ss = t.getSeconds() < 10 ? "0" + t.getSeconds() : t.getSeconds();
		var isAm = t.getHours() < 12; //is 12 am 00 am??
		me.$container.text(hh + ":" + mm + ":" + ss + (isAm ? ' AM' : ' PM'));
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
