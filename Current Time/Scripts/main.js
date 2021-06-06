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
		me.$container.text(t.toLocaleTimeString());
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
