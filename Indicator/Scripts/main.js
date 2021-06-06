var Main = function () {
	// Configs
	this.xxx = 0;

	// Variables

	// Selectors
	this.$indicator = null;
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
		this.setupTimer();
	},

	setupElementSelectors: function () {
		this.$indicator = $("div.indicator");
	},

	setupTimer: function () {
		var me = this;
		setInterval(function () {
			me.$indicator
				.toggleClass("off")
				.toggleClass("fire");
		}, 1000);
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
