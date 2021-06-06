var Main = function () {
	// Configs
	this.interval = 1000;

	// Variables
	this.intervalHandle = null;

	// Selectors
	this.$myX = null;
	this.$myY = null;
	this.$a1l = null;
	this.$a1r = null;
	this.$a1f = null;
	this.$a1b = null;
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
		this.setupRangeChangeEvent();
		this.setupMouseEvent();
		this.setupInterval();
	},

	setupElementSelectors: function () {
		this.$myX = $("#myX");
		this.$myY = $("#myY");
		this.$a1l = $("#a1l");
		this.$a1r = $("#a1r");
		this.$a1f = $("#a1f");
		this.$a1b = $("#a1b");
	},

	setupRangeChangeEvent: function () {
		var me = this;
		me.$myX.on("input", me.handleRangeInput.bind(me));
		me.$myY.on("input", me.handleRangeInput.bind(me));
	},

	setupMouseEvent: function () {
		var me = this;
		$("body").on("mousemove", me.handleBodyMouseMove.bind(me));
	},

	setupInterval: function () {
		var me = this;
		me.intervalHandle = setInterval(me.handleInterval.bind(me), me.interval);
	},

	handleRangeInput: function (e) {
		this.$a1l[0].volume = this.$myX.val() / this.$myX[0].max;
		this.$a1r[0].volume = 1 - this.$a1l[0].volume;
		this.$a1f[0].volume = this.$myY.val() / this.$myY[0].max;
		this.$a1b[0].volume = 1 - this.$a1f[0].volume;
	},

	handleBodyMouseMove: function (event) {
		var dX = Math.abs((event.pageX % (this.$myX[0].max * 2)) - this.$myX[0].max);
		this.$myX.val(dX).trigger("input");
		var dY = Math.abs((event.pageY % (this.$myY[0].max * 2)) - this.$myY[0].max);
		this.$myY.val(dY).trigger("input");
	},

	handleInterval: function (event) {
		this.$a1l[0].play();
		this.$a1r[0].play();
		this.$a1f[0].play();
		this.$a1b[0].play();
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
