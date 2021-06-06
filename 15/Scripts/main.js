var Main = function () {
	// Levels // TODO: move to separate file?
	this.levels = [ // array of levels
		{ // level 0
			//backgroundImage: "url('CSS/Images/tropics.jpg')",
			backgroundImage: null,
			field: [ // array of rows
				[ // row 1
					{y: 0, x: 0, cellType: "Tile"},
					{y: 0, x: 1, cellType: "Tile"},
					{y: 0, x: 2, cellType: "Tile"}
				],
				[ // row 2
					{y: 1, x: 0, cellType: "Tile"},
					{y: 1, x: 1, cellType: "Tile"},
					{y: 1, x: 2, cellType: "Tile"}
				],
				[ // row 3
					{y: 2, x: 0, cellType: "Tile"},
					{y: 2, x: 1, cellType: "Tile"},
					{y: 2, x: 2, cellType: null}
				]
			]
		},
		{ // level 1
			//backgroundImage: "url('CSS/Images/15.png')",
			backgroundImage: null,
			field: [ // array of rows
				[ // row 1
					{y: 0, x: 0, cellType: "Tile"},
					{y: 0, x: 1, cellType: "Tile"},
					{y: 0, x: 2, cellType: "Tile"},
					{y: 0, x: 3, cellType: "Tile"}
				],
				[ // row 2
					{y: 1, x: 0, cellType: "Tile"},
					{y: 1, x: 1, cellType: "Tile"},
					{y: 1, x: 2, cellType: "Tile"},
					{y: 1, x: 3, cellType: "Tile"}
				],
				[ // row 3
					{y: 2, x: 0, cellType: "Tile"},
					{y: 2, x: 1, cellType: "Tile"},
					{y: 2, x: 2, cellType: "Tile"},
					{y: 2, x: 3, cellType: "Tile"}
				],
				[ // row 4
					{y: 3, x: 0, cellType: "Tile"},
					{y: 3, x: 1, cellType: "Tile"},
					{y: 3, x: 2, cellType: "Tile"},
					{y: 3, x: 3, cellType: null}
				]
			]
		},
			{ // level 2
			//backgroundImage: "url('CSS/Images/tropics.jpg')",
			backgroundImage: null,
			field: [ // array of rows
				[ // row 1
					{y: 0, x: 0, cellType: "Tile"},
					{y: 0, x: 1, cellType: "Tile"},
					{y: 0, x: 2, cellType: "Tile"},
					{y: 0, x: 3, cellType: "Tile"},
					{y: 0, x: 4, cellType: "Tile"}
				],
				[ // row 2
					{y: 1, x: 0, cellType: "Tile"},
					{y: 1, x: 1, cellType: "Tile"},
					{y: 1, x: 2, cellType: "Tile"},
					{y: 1, x: 3, cellType: "Tile"},
					{y: 1, x: 4, cellType: "Tile"}
				],
				[ // row 3
					{y: 2, x: 0, cellType: "Tile"},
					{y: 2, x: 1, cellType: "Tile"},
					{y: 2, x: 2, cellType: "Tile"},
					{y: 2, x: 3, cellType: "Tile"},
					{y: 2, x: 4, cellType: "Tile"}
				],
				[ // row 4
					{y: 3, x: 0, cellType: "Tile"},
					{y: 3, x: 1, cellType: "Tile"},
					{y: 3, x: 2, cellType: "Tile"},
					{y: 3, x: 3, cellType: "Tile"},
					{y: 3, x: 4, cellType: "Tile"}
				],
				[ // row 5
					{y: 4, x: 0, cellType: "Tile"},
					{y: 4, x: 1, cellType: "Tile"},
					{y: 4, x: 2, cellType: "Tile"},
					{y: 4, x: 3, cellType: "Tile"},
					{y: 4, x: 4, cellType: null}
				]
			]
		}
	];
	
	// Configs
	this.celldHeight = 0;
	this.celldWidth = 0;
	this.fieldHeight = 0;
	this.fieldWidth = 0;
	this.animationSpeed = 200;

	// Variables
	this.currentLevel = 1;

	// Selectors
	this.$container = null;
	this.$tileTemplate = null;
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
		this.setupResizeEventHandler();
		this.setupClickEventHandler();
		this.drawField();
		this.scrambleField();
	},

	setupElementSelectors: function () {
		this.$container = $("div.container");
		this.$tileTemplate = $($("#tile-template").html());
	},

	setupResizeEventHandler: function () {
		var me = this;
		$(window).on("resize", me.resizeEventHandler.bind(me));
	},

	resizeEventHandler: function (event) {
		this.drawField();
	},

	setupClickEventHandler: function () {
		var me = this;
		me.$container.on("click", me.clickEventHandler.bind(me));
	},

	clickEventHandler: function (event) {
		var $cell = $(event.originalEvent.target);
		if ($cell.hasClass("tile")) {
			var x = $cell.attr("x") - 0;
			var y = $cell.attr("y") - 0;
			this.moveTile(x, y);
			if (this.puzzleSolved()) {
				setTimeout(function () { alert("You Won!"); }, this.animationSpeed);
			}
		}
	},

	moveTile: function (x, y) {
		if (this.swapTiles(x, y, x, y - 1)) {
			return true;
		}
		if (this.swapTiles(x, y, x, y + 1)) {
			return true;
		}
		if (this.swapTiles(x, y, x - 1, y)) {
			return true;
		}
		if (this.swapTiles(x, y, x + 1, y)) {
			return true;
		}
		return false;
	},

	swapTiles: function (sourceX, sourceY, targetX, targetY) {
		if (targetX >= 0 && targetX < this.fieldWidth && targetY >= 0 && targetY < this.fieldHeight) {
			var level = this.levels[this.currentLevel].field;
			var targetCell = level[targetY][targetX];
			if (targetCell.cellType === null) {
				level[targetY][targetX] = level[sourceY][sourceX];
				level[sourceY][sourceX] = targetCell;
				var offsetTop = this.$container[0].offsetTop + 3;
				var offsetLeft = this.$container[0].offsetLeft + 3;
				$("div.tile[x='" + sourceX + "'][y='" + sourceY + "']")
					.attr("x", targetX)
					.attr("y", targetY)
					.animate({
						"top": (targetY * this.cellHeight + offsetTop) + "px",
						"left": (targetX * this.cellWidth + offsetLeft) + "px"
					}, this.animationSpeed);
				return true;
			}
		}
		return false;
	},

	drawField: function () {
		var level = this.levels[this.currentLevel];
		this.fieldHeight = level.field.length;
		this.fieldWidth = level.field[0].length;
		this.$container
			.hide()
			.empty()
			.css({
				"height": (this.fieldHeight * this.cellHeight + 6) + "px",
				"width": (this.fieldWidth * this.cellWidth + 6) + "px"
			})
			.show();
		var offsetTop = this.$container[0].offsetTop + 3;
		var offsetLeft = this.$container[0].offsetLeft + 3;
		var offsetHeight = this.$container[0].offsetHeight - 30;
		var offsetWidth = this.$container[0].offsetWidth - 30
		var i = 0;
		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				if (level.field[y][x].cellType !== null) {
					var originalX = level.field[y][x].x;
					var originalY = level.field[y][x].y;
					var css = {};
					if (level.backgroundImage === null) {
						i = originalY * this.fieldWidth + originalX + 1;
						var $tile = this.$tileTemplate
							.clone()
							.attr("x", x)
							.attr("y", y)
							.attr("class", level.field[y][x].cellType.toLowerCase())
							.css({
								"top": (y * this.cellHeight + offsetTop) + "px",
								"left": (x * this.cellWidth + offsetLeft) + "px",
								"height": (this.cellHeight) + "px",
								"width": (this.cellWidth) + "px"})
							.text(i)
							.appendTo(this.$container);
					}
					else {
						var $tile = this.$tileTemplate
							.clone()
							.attr("x", x)
							.attr("y", y)
							.attr("class", level.field[y][x].cellType.toLowerCase())
							.css({
								"top": (y * this.cellHeight + offsetTop) + "px",
								"left": (x * this.cellWidth + offsetLeft) + "px",
								"height": (this.cellHeight) + "px",
								"width": (this.cellWidth) + "px",
								"background-image": level.backgroundImage,
								"background-size": offsetWidth + "px " + offsetHeight + "px",
								"background-position": (100 / (this.fieldWidth - 1) * originalX) + "% " + (100 / (this.fieldHeight - 1) * originalY) + "%"})
							.appendTo(this.$container);
					}
				}
			}
		}
	},

	scrambleField: function () {
		var animationSpeed = this.animationSpeed;
		this.animationSpeed = 50;
		var scrambleIterations = this.fieldWidth * this.fieldHeight * 2;
		for (var i = 0; i < scrambleIterations; i++) {
			var scrambled = false;
			var noCell = this.getNoCell();
			do {
				switch(Math.floor(Math.random() * 4)) {
					case 0:
						if (noCell.y > 0 && this.moveTile(noCell.x, noCell.y - 1)) {
							scrambled = true;
						}
						break;
					case 1:
						if (noCell.y < this.fieldHeight - 1 && this.moveTile(noCell.x, noCell.y + 1)) {
							scrambled = true;
						}
						break;
					case 2:
						if (noCell.x > 0 && this.moveTile(noCell.x - 1, noCell.y)) {
							scrambled = true;
						}
						break;
					case 3:
						if (noCell.x < this.fieldWidth - 1 && this.moveTile(noCell.x + 1, noCell.y)) {
							scrambled = true;
						}
						break;
					default:
						break;
				}
			}
			while (!scrambled);
		}
		this.animationSpeed = animationSpeed;
	},

	getNoCell: function () {
		var level = this.levels[this.currentLevel].field;
		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				if (level[y][x].cellType === null) {
					return {"x": x, "y": y};
				}
			}
		}
		return {"x": null, "y": null};
	},

	puzzleSolved: function () {
		var level = this.levels[this.currentLevel].field;
		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				if (level[y][x].x !== x || level[y][x].y !== y) {
					return false;
				}
			}
		}
		return true;
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
