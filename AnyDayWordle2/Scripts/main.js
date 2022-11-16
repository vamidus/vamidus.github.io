var Main = function () {
	// Configs

	// Variables

	// Selectors
	this.$datepicker = null;
};

Main.prototype = {
	initialize: function (settings) {
		if (settings) {
			this.applySettings(settings);
		}
		this.setup();
	},

	applySettings: function (settings) {
		$.extend(this, settings);
	},

	setup: function () {
		this.setupElementSelectors();
		this.setupDatepicker();
	},

	setupElementSelectors: function () {
		this.$datepicker = $("#datepicker");
	},

	setupDatepicker: function () {
		var me = this;
		me.$datepicker.datepicker({
			onSelect: function(dateText) {
				me.handleSelect(new Date(Date.parse(dateText)));
			}
		});
	},

	formatDate: function (date) {
	    var d = new Date(date),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [year, month, day].join('-');
	},

	handleSelect: function (date) {
		window.location.href = "https://www.nytimes.com/svc/wordle/v2/" + this.formatDate(date) + ".json";
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
