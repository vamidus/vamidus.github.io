var Main = function () {
	// Configs

	// Variables
	this.level = [];
	this.level_name = '';

	this.level_width = 0;
	this.level_height = 0;

	// Selectors
	this.$level_name = null;

	this.$level_width = null;
	this.$level_height = null;
	
	this.$level_apply = null;

	this.$level_element = null;
	this.$level_export = null;

	this.$tool_type = null;
	this.$tool_export = null;
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
		this.setupEventHandlers();
	},

	setupElementSelectors: function () {
		this.$level_name = $("#level-name");

		this.$level_width = $("#level-width");
		this.$level_height = $("#level-height");

		this.$level_apply = $("#level-apply");

		this.$level_element = $("#level-element");
		this.$level_export = $("#level-export");

		this.$tool_type = $("#tool-type");
		this.$tool_export = $("#tool-export");
	},

	setupEventHandlers: function () {
		var me = this;
		$(window).on("resize", me.scaleLevel.bind(me));
		me.$level_apply.on("click", me.handleLevelApplyClick.bind(me));
		me.$tool_export.on("click", me.handleToolExportClickV4.bind(me));
	},

	handleLevelApplyClick: function () {
		var me = this;
		me.setLevelMetadata();
		me.setupLevel()
		me.updateLevelElement();
	},

	setLevelMetadata: function () {
		var me = this;
		me.level_name = me.$level_name.val();

		me.level_width = me.$level_width.val();
		me.level_height = me.$level_height.val();
	},

	updateLevelElement: function () {
		var me = this;
		me.$level_element.empty();
		for (let y = 0; y < me.level_height; y++) {
			let $newRow = $("<div />")
				.addClass("level-row")
				.attr("id", "row-" + y)
				.data("row", y)
				.css({
					"width": me.level_width * 16 + "px", 
					"transform": "scale(1)"
				});	
			for (let x = 0; x < me.level_width; x++) {
				let classArray = ["level-cell"];
				switch(me.level[y][x].cell.type) {
					case "floor":
						classArray.push("floor");
						break;					
					case "wall":
						classArray.push("wall");
						break;
					case "pallet":
						classArray.push("pallet");
						break;
					case "start":
						classArray.push("start");
						break;
					// case "finish":
					// 	classArray.push("finish");
					// 	break;
				}
				if (me.level[y][x].cell.isCrate) {
					classArray.push("crate");
				} else if (me.level[y][x].cell.isWorker) {
					classArray.push("worker");
				}
				$("<div />")
					.addClass(classArray.join(" "))
					.attr("id", "cell-x" + x + "-y" + y)
					.data("x", x)
					.data("y", y)
					.appendTo($newRow);
			}
			$newRow.appendTo(me.$level_element);
		}
		me.setupCells();
		me.scaleLevel();
	},

	setupLevel: function () {
		var me = this;
		me.level = [];
		for (let y = 0; y < me.level_height; y++) {
			let newRow = [];
			for (let x = 0; x < me.level_width; x++) {
				newRow.push({
					cell: {
						type: "floor",
						isWorker: false,
						isCrate: false
					}
				});
			}
			me.level.push(newRow);
		}
	},

	setupCells: function () {
		var me = this;
		me.$level_element
			.find("div.level-cell")
			.on("click", me.handleLevelCellClick.bind(me));
	},

	handleLevelCellClick: function (e) {
		var me = this;
		let $cell = $(e.target);
		let x = $cell.data("x");
		let y = $cell.data("y");
		let type = me.$tool_type.val();
		if (type === 'crate') {
			if (me.level[y][x].cell.type !== 'pallet') {
				me.level[y][x].cell.type = 'floor'
			};
			me.level[y][x].cell.isCrate = true;
		} else {
			me.level[y][x].cell.type = type;
			me.level[y][x].cell.isCrate = false;
		}
		me.updateLevelElement();
	},

	handleToolExportClickV1: function () {
		var me = this;
		var levelHash = me.getLevelHash();
		var result = {
			name: me.level_name,
			height: me.level_height,
			width: me.level_width,
			hash: levelHash
		};
		me.$level_export.text(JSON.stringify(result));
	},

	handleToolExportClickV2: function () {
		var me = this;
		var levelHash = me.getLevelHash();
		var result = {
			name: me.level_name,
			height: me.level_height,
			width: me.level_width,
			hash: levelHash
		};
		me.$level_export.text(LZString.compress(JSON.stringify(result)));
	},

	handleToolExportClickV3: function () {
		var me = this;
		var levelHash = me.getLevelHash();
		var result = {
			name: me.level_name,
			height: me.level_height,
			width: me.level_width,
			hash: levelHash
		};
		prompt("Here's your level!", LZString.compress(JSON.stringify(result)));
	},

	handleToolExportClickV4: function () {
		var me = this;
		var levelHash = me.getLevelHash();
		var result = {
			name: me.level_name,
			height: me.level_height,
			width: me.level_width,
			hash: compress(levelHash)
		};
		prompt("Here's your level!", JSON.stringify(result));
	},

	getLevelHash: function () {
		var me = this;
		var result = '';
		for (let y = 0; y < me.level_height; y++) {
			for (let x = 0; x < me.level_width; x++) {
				switch (me.level[y][x].cell.type) {
					case "floor":
						if (me.level[y][x].cell.isCrate) {
							result += 'C';
						} else {
							result += 'F';
						}
						break;					
					case "wall":
						result += 'W';
						break;
					case "pallet":
						if (me.level[y][x].cell.isCrate) {
							result += 'G';
						} else {
							result += 'P';
						}
						break;
					case "start":
						result += 'S';
						break;
					case "finish":
						result += 'E';
						break;
				}
			}
		}
		return result;
	},

	scaleLevel: function () {
		let me = this;
		let heightRatio = me.$level_element.parent().height() / me.$level_element.height();
		let widthRatio = me.$level_element.parent().width() / me.$level_element.width();
		if (heightRatio < widthRatio) {
			me.$level_element.css("transform", `scale(${(Math.floor(heightRatio * 8) / 8).toFixed(3)})`);
		} else {
			me.$level_element.css("transform", `scale(${(Math.floor(widthRatio * 8) / 8).toFixed(3)})`);
		}
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};