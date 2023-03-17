let Main = function () {
	// Configs

	// Variables
	this.level = [];
	this.level_name = '';

	this.level_width = 0;
	this.level_height = 0;

	this.select_start = {x: null, y: null};
	this.select_end = {x: null, y: null};

	// Selectors
	this.$create_level_dialog = null;
	this.$level_name = null;

	this.$level_width = null;
	this.$level_height = null;
	
	this.$level_element = null;

	this.$tool_export = null;
	this.$tool_import = null;
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
		this.showCreateLevelDialog();
	},

	setupElementSelectors: function () {
		this.$create_level_dialog = $("#create-level-dialog");
		this.$level_name = $("#level-name");

		this.$level_width = $("#level-width");
		this.$level_height = $("#level-height");

		this.$level_element = $("#level-element");

		this.$tool_export = $("#tool-export");
		this.$tool_import = $("#tool-import");
	},

	setupEventHandlers: function () {
		let me = this;
		$(window).on("resize", me.scaleLevel.bind(me));
		me.$tool_export.on("click", me.handleToolExportClick.bind(me));
		me.$tool_import.on("click", me.handleToolImportClick.bind(me));
	},

	showCreateLevelDialog: function () {
		let me = this;
		me.$create_level_dialog.dialog({
			buttons: [
				{
					text: 'Create Level',
					click: function () {
						me.setLevelMetadata();
						me.setupLevel()
						me.updateLevelElement();
						$(this).dialog("close");
					}
				}
			],
			closeOnEscape: false,
			dialogClass: 'ibm-font',
			modal: true,
			resizable: false
		});
	},

	setLevelMetadata: function () {
		let me = this;
		me.level_name = me.$level_name.val();

		me.level_width = me.$level_width.val();
		me.level_height = me.$level_height.val();
	},

	updateLevelElement: function () {
		let me = this;
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
		let me = this;
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
		let me = this;
		me.$level_element
			.find("div.level-cell")
			.on("click", me.handleLevelCellClick.bind(me))
			.on("mousedown", me.handleLevelCellMousedown.bind(me))
			.on("mouseup", me.handleLevelCellMouseup.bind(me));
	},

	handleLevelCellClick: function (e) {
		let me = this;
		let $cell = $(e.target);
		me.setCellType($cell.data("x"), $cell.data("y"), $("input[name=tool-type]:checked").val());
		me.updateLevelElement();
	},

	setCellType: function (x, y, type) {
		let me = this;
		if (type === 'crate') {
			if (me.level[y][x].cell.type !== 'pallet') {
				me.level[y][x].cell.type = 'floor';
			};
			me.level[y][x].cell.isCrate = true;
		} else if (type === 'stack') {
			me.level[y][x].cell.type = 'pallet';
			me.level[y][x].cell.isCrate = true;
		} else {
			me.level[y][x].cell.type = type;
			me.level[y][x].cell.isCrate = false;
		}
	},

	handleLevelCellMousedown: function (e) {
		if (e.which !== 1) return;
		let me = this;
		let $cell = $(e.target);
		me.select_start = {
			x: $cell.data("x"),
			y: $cell.data("y")
		};
	},

	handleLevelCellMouseup: function (e) {
		if (e.which !== 1) return;
		let me = this;
		let $cell = $(e.target);
		let x = $cell.data("x");
		let y = $cell.data("y");
		if (me.select_start.x === x && me.select_start.y === y) {
			me.select_start = {
				x: null,
				y: null
			};
			me.select_end = {
				x: null,
				y: null
			};
		} else {
			if (me.select_start.x > x) {
				me.select_end.x = me.select_start.x;
				me.select_start.x = x;
			} else {
				me.select_end.x = x
			}
			if (me.select_start.y > y) {
				me.select_end.y = me.select_start.y;
				me.select_start.y = y;
			} else {
				me.select_end.y = y
			}
		}
		me.updateSelection();
	},

	updateSelection: function () {
		let me = this;
		let type = $("input[name=tool-type]:checked").val();
		if (me.select_start.x !== null && me.select_start.y !== null && type !== null) {
			for (let y = me.select_start.y; y <= me.select_end.y; y++) {
				for (let x = me.select_start.x; x <= me.select_end.x; x++) {
					me.setCellType(x, y, type);
				}
			}
			me.updateLevelElement();
		}
	},

	handleToolExportClick: function () {
		let me = this;
		let levelHash = me.getLevelHash();
		let result = {
			name: me.level_name,
			height: me.level_height,
			width: me.level_width,
			hash: compress(levelHash)
		};
		prompt("Here's your level!", JSON.stringify(result));
	},

	handleToolImportClick: function () {
		let me = this;
		let levelString = prompt("Paste the level here:");
		if (levelString === null) return;
		let level = JSON.parse(levelString);
		me.level_name = level.name;
		me.$level_name.val(me.level_name);
		me.level_height = level.height;
		me.$level_height.val(me.level_height);
		me.level_width = level.width;
		me.$level_width.val(me.level_width);
		me.level_hash = decompress(level.hash);
		me.level = [];
		for (let y = 0; y < me.level_height; y++) {
			let newRow = [];
			for (let x = 0; x < me.level_width; x++) {
				let cellType = me.level_hash.charAt(y * me.level_width + x);
				switch (cellType) {
					case "F":
						newRow.push({
							cell: {
								type: "floor",
								isWorker: false,
								isCrate: false
							}
						});
						break;
					case "C":
						newRow.push({
							cell: {
								type: "floor",
								isWorker: false,
								isCrate: true
							}
						});
						break;
					case "W":
						newRow.push({
							cell: {
								type: "wall",
								isWorker: false,
								isCrate: false
							}
						});
						break;
					case "P":
						newRow.push({
							cell: {
								type: "pallet",
								isWorker: false,
								isCrate: false
							}
						});
						break;
					case "G":
						newRow.push({
							cell: {
								type: "pallet",
								isWorker: false,
								isCrate: true
							}
						});
						break;
					case "S":
						newRow.push({
							cell: {
								type: "start",
								isWorker: true,
								isCrate: false
							}
						});
						break;
				}
			}
			me.level.push(newRow);
		}
		me.updateLevelElement();
	},

	getLevelHash: function () {
		let me = this;
		let result = '';
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
	let instance = new Main();
	instance.initialize(settings);
};