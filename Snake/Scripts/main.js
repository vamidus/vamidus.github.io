var Main = function () {
	// Configs
	this.levels = [];

	// Variables

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
		this.setupXxx();
	},

	setupElementSelectors: function () {
		this.$xxx = $("xxx");
	},

	setupXxx: function () {
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
