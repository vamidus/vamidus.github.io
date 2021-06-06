var Main = function () {
	// Configs
	this.aspectRatio = 0;
	this.initialInterval = 0;
	this.lives = 0;

	// Variables
	this.rabbit = [true];
	this.rabbit_hand = [false, false];
	this.life = [false, false, false];
	this.broken_egg = [false, false];
	this.chick = [[false, false, false, false], [false, false, false, false]];
	this.egg = [[false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false]];
	this.wolf = [[true, false], [false, false]];
	this.intervalHandle = null;
	this.timeoutHandle = null;
	this.currentRamp = 0;
	this.score = 0;

	// Selectors
	this.$content = null;
	this.$scoreBoard = null;
	this.$overlay = null;
	this.$rabbit = null;
	this.$rabbit_hand_1 = null;
	this.$rabbit_hand_2 = null;
	this.$life_1 = null;
	this.$life_2 = null;
	this.$life_3 = null;
	this.$broken_egg_a = null;
	this.$broken_egg_b = null;
	this.$chick_a1 = null;
	this.$chick_a2 = null;
	this.$chick_a3 = null;
	this.$chick_a4 = null;
	this.$chick_b1 = null;
	this.$chick_b2 = null;
	this.$chick_b3 = null;
	this.$chick_b4 = null;
	this.$egg_a11 = null;
	this.$egg_a12 = null;
	this.$egg_a13 = null;
	this.$egg_a14 = null;
	this.$egg_a15 = null;
	this.$egg_a21 = null;
	this.$egg_a22 = null;
	this.$egg_a23 = null;
	this.$egg_a24 = null;
	this.$egg_a25 = null;
	this.$egg_b11 = null;
	this.$egg_b12 = null;
	this.$egg_b13 = null;
	this.$egg_b14 = null;
	this.$egg_b15 = null;
	this.$egg_b21 = null;
	this.$egg_b22 = null;
	this.$egg_b23 = null;
	this.$egg_b24 = null;
	this.$egg_b25 = null;
	this.$wolf_a1 = null;
	this.$wolf_a2 = null;
	this.$wolf_b1 = null;
	this.$wolf_b2 = null;
	this.chirp_a1 = null;
	this.chirp_a2 = null;
	this.chirp_b1 = null;
	this.chirp_b2 = null;
}

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
		this.setupWindowOnResizeHandler();
		this.setupPlayerInputEventHandler();
		this.setupClockIntervalHandler();
	},

	setupElementSelectors: function () {
		this.$content = $("#content");
		this.$scoreBoard = $("#score-board");
		this.$overlay = $("#overlay");
		this.$rabbit = $("#rabbit");
		this.$rabbit_hand_1 = $("#rabbit-hand-1");
		this.$rabbit_hand_2 = $("#rabbit-hand-2");
		this.$life_1 = $("#life-1");
		this.$life_2 = $("#life-2");
		this.$life_3 = $("#life-3");
		this.$broken_egg_a = $("#broken-egg-a");
		this.$broken_egg_b = $("#broken-egg-b");
		this.$chick_a1 = $("#chick-a1");
		this.$chick_a2 = $("#chick-a2");
		this.$chick_a3 = $("#chick-a3");
		this.$chick_a4 = $("#chick-a4");
		this.$chick_b1 = $("#chick-b1");
		this.$chick_b2 = $("#chick-b2");
		this.$chick_b3 = $("#chick-b3");
		this.$chick_b4 = $("#chick-b4");
		this.$egg_a11 = $("#egg-a11");
		this.$egg_a12 = $("#egg-a12");
		this.$egg_a13 = $("#egg-a13");
		this.$egg_a14 = $("#egg-a14");
		this.$egg_a15 = $("#egg-a15");
		this.$egg_a21 = $("#egg-a21");
		this.$egg_a22 = $("#egg-a22");
		this.$egg_a23 = $("#egg-a23");
		this.$egg_a24 = $("#egg-a24");
		this.$egg_a25 = $("#egg-a25");
		this.$egg_b11 = $("#egg-b11");
		this.$egg_b12 = $("#egg-b12");
		this.$egg_b13 = $("#egg-b13");
		this.$egg_b14 = $("#egg-b14");
		this.$egg_b15 = $("#egg-b15");
		this.$egg_b21 = $("#egg-b21");
		this.$egg_b22 = $("#egg-b22");
		this.$egg_b23 = $("#egg-b23");
		this.$egg_b24 = $("#egg-b24");
		this.$egg_b25 = $("#egg-b25");
		this.$wolf_a1 = $("#wolf-a1");
		this.$wolf_a2 = $("#wolf-a2");
		this.$wolf_b1 = $("#wolf-b1");
		this.$wolf_b2 = $("#wolf-b2");
		this.chirp_a1 = document.getElementById("chirp-a1");
		this.chirp_a2 = document.getElementById("chirp-a2");
		this.chirp_b1 = document.getElementById("chirp-b1");
		this.chirp_b2 = document.getElementById("chirp-b2");
	},

	setupWindowOnResizeHandler: function () {
		var me = this;
		$(window).on("resize", me.windowOnResizeHandler.bind(me));
		this.windowOnResizeHandler();
	},

	windowOnResizeHandler: function (event) {
		var containerWidth = window.innerWidth;
		var containerHeight = window.innerHeight;
		var containerAspectRatio = containerHeight / containerWidth;
		var contentLeft = 0;
		var contentTop = 0;
		var contentWidth = 0;
		var contentHeight = 0;
		if (containerAspectRatio < this.aspectRatio) {
			contentLeft = (containerWidth - containerHeight / this.aspectRatio) / 2;
			contentTop = 0;
			contentWidth = containerHeight / this.aspectRatio;
			contentHeight = containerHeight;
		}
		else if (containerAspectRatio > this.aspectRatio) {
			contentLeft = 0;
			contentTop = (containerHeight - containerWidth * this.aspectRatio) / 2;
			contentWidth = containerWidth;
			contentHeight = containerWidth * this.aspectRatio;
		}
		else {
			contentLeft = 0;
			contentTop = 0;
			contentWidth = containerWidth;
			contentHeight = containerHeight;
		}
		this.$content.css({
			left: contentLeft,
			top: contentTop,
			width: contentWidth,
			height: contentHeight
		});
	},

	setupPlayerInputEventHandler: function () {
		var me = this;
		$(document).on("keyup", me.playerInputEventHandler.bind(me));
	},

	playerInputEventHandler: function (event) {
		switch (event.originalEvent.key.toLowerCase()) {
			case "w": // up
			case "arrowup":
				if (this.wolf[0][0] === false && this.wolf[0][1] === true) {
					this.wolf[0][0] = true;
					this.wolf[0][1] = false;
					this.updateDisplayWolf();
				}
				else if (this.wolf[1][0] === false && this.wolf[1][1] === true) {
					this.wolf[1][0] = true;
					this.wolf[1][1] = false;
					this.updateDisplayWolf();
				}
				break;
			case "a": // left
			case "arrowleft":
				if (this.wolf[0][0] === false && this.wolf[1][0] === true) {
					this.wolf[0][0] = true;
					this.wolf[1][0] = false;
					this.updateDisplayWolf();
				}
				else if (this.wolf[0][1] === false && this.wolf[1][1] === true) {
					this.wolf[0][1] = true;
					this.wolf[1][1] = false;
					this.updateDisplayWolf();
				}
				break;
			case "s": // down
			case "arrowdown":
				if (this.wolf[0][1] === false && this.wolf[0][0] === true) {
					this.wolf[0][1] = true;
					this.wolf[0][0] = false;
					this.updateDisplayWolf();
				}
				else if (this.wolf[1][1] === false && this.wolf[1][0] === true) {
					this.wolf[1][1] = true;
					this.wolf[1][0] = false;
					this.updateDisplayWolf();
				}
				break;
			case "d": // right
			case "arrowright":
				if (this.wolf[1][0] === false && this.wolf[0][0] === true) {
					this.wolf[1][0] = true;
					this.wolf[0][0] = false;
					this.updateDisplayWolf();
				}
				else if (this.wolf[1][1] === false && this.wolf[0][1] === true) {
					this.wolf[1][1] = true;
					this.wolf[0][1] = false;
					this.updateDisplayWolf();
				}
				break;
			default:
				break;
		}
	},

	updateDisplay: function () {
		this.updateDisplayRabbit();
		this.updateDisplayLife();
		this.updateDisplayBrokenEgg();
		this.updateDisplayChick();
		this.updateDisplayEgg();
		this.updateDisplayWolf();
		this.$scoreBoard.text(this.score);
	},

	updateDisplayRabbit: function () {
		this.$rabbit.toggle(this.rabbit[0]);
		this.$rabbit_hand_1.toggle(this.rabbit_hand[0]);
		this.$rabbit_hand_2.toggle(this.rabbit_hand[1]);
	},

	updateDisplayLife: function () {
		this.$life_1.toggle(this.life[0]);
		this.$life_2.toggle(this.life[1]);
		this.$life_3.toggle(this.life[2]);
	},

	updateDisplayBrokenEgg: function () {
		this.$broken_egg_a.toggle(this.broken_egg[0]);
		this.$broken_egg_b.toggle(this.broken_egg[1]);
	},

	updateDisplayChick: function () {
		this.$chick_a1.toggle(this.chick[0][0]);
		this.$chick_a2.toggle(this.chick[0][1]);
		this.$chick_a3.toggle(this.chick[0][2]);
		this.$chick_a4.toggle(this.chick[0][3]);
		this.$chick_b1.toggle(this.chick[1][0]);
		this.$chick_b2.toggle(this.chick[1][1]);
		this.$chick_b3.toggle(this.chick[1][2]);
		this.$chick_b4.toggle(this.chick[1][3]);
	},

	updateDisplayEgg: function () {
		this.$egg_a11.toggle(this.egg[0][0]);
		this.$egg_a12.toggle(this.egg[0][1]);
		this.$egg_a13.toggle(this.egg[0][2]);
		this.$egg_a14.toggle(this.egg[0][3]);
		this.$egg_a15.toggle(this.egg[0][4]);
		this.$egg_a21.toggle(this.egg[1][0]);
		this.$egg_a22.toggle(this.egg[1][1]);
		this.$egg_a23.toggle(this.egg[1][2]);
		this.$egg_a24.toggle(this.egg[1][3]);
		this.$egg_a25.toggle(this.egg[1][4]);
		this.$egg_b11.toggle(this.egg[2][0]);
		this.$egg_b12.toggle(this.egg[2][1]);
		this.$egg_b13.toggle(this.egg[2][2]);
		this.$egg_b14.toggle(this.egg[2][3]);
		this.$egg_b15.toggle(this.egg[2][4]);
		this.$egg_b21.toggle(this.egg[3][0]);
		this.$egg_b22.toggle(this.egg[3][1]);
		this.$egg_b23.toggle(this.egg[3][2]);
		this.$egg_b24.toggle(this.egg[3][3]);
		this.$egg_b25.toggle(this.egg[3][4]);
	},

	updateDisplayWolf: function () {
		this.$wolf_a1.toggle(this.wolf[0][0]);
		this.$wolf_a2.toggle(this.wolf[0][1]);
		this.$wolf_b1.toggle(this.wolf[1][0]);
		this.$wolf_b2.toggle(this.wolf[1][1]);
	},

	setupClockIntervalHandler: function () {
		var me = this;
		if (me.intervalHandle != null) {
			clearInterval(me.intervalHandle);
		}
		me.intervalHandle = setInterval(me.clockIntervalHandler.bind(me), me.initialInterval);
	},

	clockIntervalHandler: function (event) {
		var me = this;

		me.advanceEgss();
		me.processChicks();
		me.processBrokenEggs();
		me.processLives();
		me.updateDisplay();		
		
		me.processEndGame();

		if (++me.currentRamp === me.egg.length) {
			me.currentRamp = 0;
		}
	},

	protectFallingEgg: function () {
		var me = this;
		if (me.currentRamp === 0 && me.egg[0][me.egg[0].length - 1] === true && me.wolf[0][0] === false) { // top left
			for (var y = 0; y < me.wolf.length; y++) {
				for (var x = 0; x < me.wolf[y].length; x++) {
					me.wolf[y][x] = false;
				}
			}
			me.wolf[0][0] = true;
			me.updateDisplay();
			return;
		}
		if (me.currentRamp === 2 && me.egg[2][me.egg[2].length - 1] === true && me.wolf[1][0] === false) { // top right
			for (var y = 0; y < me.wolf.length; y++) {
				for (var x = 0; x < me.wolf[y].length; x++) {
					me.wolf[y][x] = false;
				}
			}
			me.wolf[1][0] = true;
			me.updateDisplay();
			return;
		}
		if (me.currentRamp === 1 && me.egg[1][me.egg[1].length - 1] === true && me.wolf[0][1] === false) { // bottom left
			for (var y = 0; y < me.wolf.length; y++) {
				for (var x = 0; x < me.wolf[y].length; x++) {
					me.wolf[y][x] = false;
				}
			}
			me.wolf[0][1] = true;
			me.updateDisplay();
			return;
		}
		if (me.currentRamp === 3 && me.egg[3][me.egg[3].length - 1] === true && me.wolf[1][1] === false) { // bottom right
			for (var y = 0; y < me.wolf.length; y++) {
				for (var x = 0; x < me.wolf[y].length; x++) {
					me.wolf[y][x] = false;
				}
			}
			me.wolf[1][1] = true;
			me.updateDisplay();
			return;
		}
	},

	advanceEgss: function () {
		var me = this;
		var makeSound = false;

		for (var x = me.egg[me.currentRamp].length - 1; x > 0; x--) {
			if (x === me.egg[me.currentRamp].length - 1 && me.egg[me.currentRamp][x]) {
				me.protectFallingEgg(); // this is AI.. deal with this later!		
				me.processFallingEgg();
				me.egg[me.currentRamp][x] = false;
				var makeSound = true;
			}
			if (me.egg[me.currentRamp][x - 1]) {
				me.egg[me.currentRamp][x] = true;
				me.egg[me.currentRamp][x - 1] = false;
				makeSound = true;
			}
		}
		
		if (me.hatchNewEgg()) {
			makeSound = true;
		}
		
		if (makeSound) {
			me.eggSound();
		}
	},

	processFallingEgg: function () {
		var me = this;
		switch (me.currentRamp) {
			case 0:
				if (me.egg[0][me.egg[0].length - 1]) { // top left
					if (me.wolf[0][0]) {
						me.processScore();
					}
					else {
						me.lives = me.lives - 2; // todo: process end of lives
						me.broken_egg[0] = true;
					}
				}
				break;
			case 1:
				if (me.egg[1][me.egg[1].length - 1]) { // bottom left
					if (me.wolf[0][1]) {
						me.processScore();
					}
					else {
						me.lives--; // todo: process end of lives
						me.broken_egg[0] = true;
						me.chick[0][0] = true;
					}
				}
				break;
			case 2:
				if (me.egg[2][me.egg[2].length - 1]) { // top right
					if (me.wolf[1][0]) {
						me.processScore();
					}
					else {
						me.lives = me.lives - 2 // todo: process end of lives
						me.broken_egg[1] = true;
					}
				}
				break;
			case 3:
				if (me.egg[3][me.egg[3].length - 1]) { // bottom right
					if (me.wolf[1][1]) {
						me.processScore();
					}
					else {
						me.lives--; // todo: process end of lives
						me.broken_egg[1] = true;
						me.chick[1][0] = true;
					}
				}
				break;
		}
		me.chirp_b2.play();
		me.chirp_b1.play();
		me.chirp_a2.play();
		me.chirp_a1.play();
	},

	processScore: function () {
		var me = this;
		me.$scoreBoard.text(++me.score);
		//me.initialInterval = Math.max(me.initialInterval - .1, 1);
		//me.setupClockIntervalHandler();
		me.chirp_b2.play();
		me.chirp_b1.play();
		me.chirp_a2.play();
		me.chirp_a1.play();
	},

	hatchNewEgg: function () {
		var me = this;
		var rampEggCount = 0;
		var totalEggCount = 0;
		
		for (var y = 0; y < me.egg.length; y++) {
			for (var x = 0; x < me.egg[y].length; x++) {
				if (me.egg[y][x]) {
					totalEggCount++;
					if (y === me.currentRamp) {
						rampEggCount++;
					}
				}
			}
		}
		
		if (!me.egg[me.currentRamp][0] && Math.floor(Math.random() * (totalEggCount * 20 + rampEggCount * 10 + 1)) < 5) {
			me.egg[me.currentRamp][0] = true;
			return true;
		}
		
		return false;
	},

	eggSound: function () {
		switch (this.currentRamp) {
			case 0:
				this.chirp_a1.play();
				break;
			case 1:
				this.chirp_a2.play();
				break;
			case 2:
				this.chirp_b1.play();
				break;
			case 3:
				this.chirp_b2.play();
				break;
			default:
				break
		}
	},

	processChicks: function () {
		var me = this;
		if (me.currentRamp === 0) {
			for (var y = 0; y < me.chick.length; y++) {
				for (var x = me.chick[y].length - 1; x > 0; x--) {
					if (me.chick[y][x - 1]) {
						me.chick[y][x - 1] = false;
						me.chick[y][x] = true;
					}
					else {
						me.chick[y][x] = false;
					}
				}
			}
		}
	},

	processBrokenEggs: function () {
		var me = this;
		for (var i = 0; i < me.broken_egg.length; i++) {
			if (me.broken_egg[i]) {
				me.timeoutHandle = setTimeout(me.processBrokenEgg.bind(me, i), me.initialInterval); // re-use handle?
			}
		}
	},

	processBrokenEgg: function (eggId) {
		this.broken_egg[eggId] = false;
	},

	processLives: function () {
		var me = this;
		for (var i = 0; i < me.life.length; i++) {
			if (Math.floor(me.lives / 2) === i) { // even
				me.life[i] = (me.lives % 2) ? !me.life[i] : true;
				for (var t = i + 1; t < me.life.length; t++) {
					me.life[t] = true;
				}
				break;
			}
			me.life[i] = false;;
		}
	},

	processEndGame: function () {
		var me = this;
		if (me.lives <= 0) {
			//me.lives = 6;
			me.chirp_b2.play();
			me.chirp_b1.play();
			me.chirp_a2.play();
			me.chirp_a1.play();
			me.chirp_b2.play();
			me.chirp_b1.play();
			me.chirp_a2.play();
			me.chirp_a1.play();
			me.chirp_b2.play();
			me.chirp_b1.play();
			me.chirp_a2.play();
			me.chirp_a1.play();
			clearInterval(me.intervalHandle);
			alert("Game Over!");
		}
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
