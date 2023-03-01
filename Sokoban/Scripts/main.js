let Main = function () {
	// Configs
	this.level_array = [];
	this.show_help_on_startup = false;

	// Variables
	this.completed_levels = [];
	this.custom_level = null;

	this.ignore_keyboard = false;

	this.level = [];
	this.level_id = 0;
	this.level_hash = ''; // decompressed hash
	this.level_name = '';
	this.level_steps_best = 0;
	this.level_steps_current = -1;

	this.level_width = 0;
	this.level_height = 0;

	this.worker_x = 0;
	this.worker_y = 0;
	this.worker_orientation = 'b';

	// Selectors
	this.$button_custom = null;
	this.$button_delete = null;
	this.$button_help = null;
	this.$button_left = null;
	this.$button_top = null;
	this.$button_restart = null;
	this.$button_right = null;
	this.$button_bottom = null;
	this.$best_number_of_steps = null;
	this.$current_number_of_steps = null;
	this.$level_element = null;
	this.$level_select = null;
	this.$win_dialog = null;
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
		this.setupLevelSelect();
		this.setupEventHandlers();
		this.getCookies();
		this.consumeCookies();
		this.setupLevel();
		if (this.show_help_on_startup) this.$button_help.click();
		this.updateLevelElement();
	},

	setupElementSelectors: function () {
		this.$button_custom = $("#button-custom");
		this.$button_delete = $("#button-delete");
		this.$button_help = $("#button-help");
		this.$button_left = $("#button-left");
		this.$button_top = $("#button-top");
		this.$button_restart = $("#button-restart");
		this.$button_right = $("#button-right");
		this.$button_bottom = $("#button-bottom");
		this.$best_number_of_steps = $("#best-number-of-steps");
		this.$current_number_of_steps = $("#current-number-of-steps");
		this.$level_element = $("#level-element");
		this.$level_select = $("#level-select");
		this.$win_dialog = $("#win-dialog");
	},

	setupLevelSelect: function () {
		let me = this;
		me.$level_select.find("option").remove();
		for (let i = 0; i < me.level_array.length; i++) {
			let level = me.level_array[i];
			if (level === null) continue;
			let newOption = $("<option />")
				.val(i)
				.text(level.name);
			newOption.appendTo(me.$level_select);
		}
	},

	setupEventHandlers: function () {
		let me = this;
		$("body").on("keydown", me.handleKeyPress.bind(me));
		$(window).on("resize", me.scaleLevel.bind(me));
		me.$button_custom.on("click", me.handleCustomClick.bind(me));
		me.$button_delete.on("click", me.handleDeleteClick.bind(me));
		me.$button_help.on("click", me.handleHelpClick.bind(me));
		me.$button_left.on("click", me.handleLeftClick.bind(me));
		me.$button_top.on("click", me.handleTopClick.bind(me));
		me.$button_restart.on("click", me.handleRestartClick.bind(me));
		me.$button_right.on("click", me.handleRightClick.bind(me));
		me.$button_bottom.on("click", me.handleBottomClick.bind(me));
		me.$level_select.on("change", me.handleLevelSelectChange.bind(me));
	},

	getCookies: function () {
		let me = this;
		let completedLevels = me.getCookie("completedLevels");
		me.completed_levels = completedLevels === null ? [] : JSON.parse(completedLevels);
		let showHelpOnStartup = me.getCookie("showHelpOnStartup")
		me.show_help_on_startup = showHelpOnStartup === null ? true : (showHelpOnStartup === "true");
	},

	getCookie: function (name) {
		let cookieArray = decodeURIComponent(document.cookie).split(";");
		for (let i = 0; i < cookieArray.length; i++) {
			let cookieNameValueArray = cookieArray[i].split("=");
			if (cookieNameValueArray[0].trim() === name) {
				return cookieNameValueArray[1].trim();
			}
		}
		return null;
	},

	consumeCookies: function () {
		let me = this;
		let current_md5 = (me.custom_level !== null) // this logic is to operate on compressed hashes only
			? md5(me.custom_level.hash)
			: md5(me.level_array[me.level_id].hash); 
		me.level_steps_best = 0;
		for (let i = 0; i < me.completed_levels.length; i++) {
			if (me.completed_levels[i].md5 === current_md5) {
				me.level_steps_best = me.completed_levels[i].steps;
				return;
			}
		}
	},

	setCookie: function (name, value, daysToExpiration) {
		const d = new Date();
		d.setTime(d.getTime() + (daysToExpiration * 24 * 60 * 60 * 1000));
		document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/;`;
	},

	handleLevelSelectChange: function (e) {
		let me = this;
		me.custom_level = null;
		me.level_id = $(e.target).val();
		me.$button_restart.click();
		me.$level_select.blur();
		me.$level_element.focus();
	},

	handleKeyPress: function (e) {
		let me = this;
		if (!me.ignore_keyboard) {
			switch (e.which) {
				case 27: // Esc
					me.$button_help.click();
					break;
				case 32: // Space
					me.$button_restart.click();
					break;
				case 37: // Left arrow key
					me.$button_left.click();
					break;
				case 38: // Up arrow key
					me.$button_top.click();
					break;
				case 39: // Right arrow key
					me.$button_right.click();
					break;
				case 40: // Down arrow key
					me.$button_bottom.click();
					break;
			}
		}
	},

	handleCustomClick: function () {
		let me = this;
		let level = prompt("Please paste the level {object} below and press [Ok]", "{\"name\":\"Level 1\",\"height\":\"3\",\"width\":\"30\",\"hash\":\"W31SCF25PW31\"}");
		if (level !== null && level !== "") {
			me.custom_level = JSON.parse(level);
			me.level_steps_current = -1;
			me.getCookies();
			me.consumeCookies();
			me.updateNumberOfSteps();
			me.setupLevel();
			me.updateLevelElement();
		}
		me.$button_custom.blur();
		me.$level_element.focus();
	},

	handleDeleteClick: function () {
		if (confirm("Are you sure you want to delete all cookies?")) {
			let me = this;
			me.setCookie("completedLevels", "", -1);
			me.setCookie("showHelpOnStartup", "", -1);
			me.$button_restart.click()
			me.$level_select.blur();
			me.$button_delete.blur();
			me.$level_element.focus();
		}
	},

	handleHelpClick: function () {
		let me = this;
		me.ignore_keyboard = true;
		$("#help-dialog").dialog({
			beforeClose: function () {
				me.updateShowHelpSetting();
				me.ignore_keyboard = false;
			},
			buttons: [
				{
					text: "Ok",
					title: "Close Help",
					click: function () {
						$(this).dialog("close");
					}
				}
			],
			create: function (e, ui) {
				let pane = $(this).dialog("widget").find(".ui-dialog-buttonpane");
				$(`<div class='form-check form-switch'><input ${(me.show_help_on_startup === true ? "checked" : "")} class='form-check-input' id='checkbox-show-help' type='checkbox' value='' /><label class='form-check-label' for='checkbox-show-help'>Show this on startup</label></div>`)
					.prependTo(pane);
			},
			dialogClass: 'ibm-font',
			width: 535
		});
	},

	updateShowHelpSetting: function () {
		let me = this;
		me.show_help_on_startup = $("#checkbox-show-help")[0].checked;
		me.setCookie("showHelpOnStartup", me.show_help_on_startup, 365);
	},

	handleRestartClick: function () {
		let me = this;
		me.level_steps_current = -1;
		me.getCookies();
		me.consumeCookies();
		me.setupLevel();
		me.updateLevelElement();
		me.$button_restart.blur();
		me.$level_element.focus();
	},

	handleLeftClick: function () {
		let me = this;
		if (me.level.length === 0
			|| me.worker_x - 1 < 0) return;
		me.worker_orientation = 'l';
		if (me.level[me.worker_y][me.worker_x - 1].cell.isCrate) {
			if (me.worker_x - 2 < 0) return;
			if (!me.level[me.worker_y][me.worker_x - 2].cell.isCrate
				&& me.canMoveOver(me.level[me.worker_y][me.worker_x - 2].cell.type)) {
				me.level[me.worker_y][me.worker_x].cell.isWorker = false;
				me.level[me.worker_y][me.worker_x - 1].cell.isWorker = true;
				me.level[me.worker_y][me.worker_x - 1].cell.isCrate = false;
				me.level[me.worker_y][me.worker_x - 2].cell.isCrate = true;
				me.updateLevelElement();
			}
		} else if (me.canMoveOver(me.level[me.worker_y][me.worker_x - 1].cell.type)) {
			me.level[me.worker_y][me.worker_x].cell.isWorker = false;
			me.level[me.worker_y][me.worker_x - 1].cell.isWorker = true;
			me.updateLevelElement();
		}
	},

	handleTopClick: function () {
		let me = this;
		if (me.level.length === 0
			|| me.worker_y - 1 < 0) return;
		me.worker_orientation = 't';
		if (me.level[me.worker_y - 1][me.worker_x].cell.isCrate) {
			if (me.worker_y - 2 < 0) return;
			if (!me.level[me.worker_y - 2][me.worker_x].cell.isCrate
				&& me.canMoveOver(me.level[me.worker_y - 2][me.worker_x].cell.type)) {
				me.level[me.worker_y][me.worker_x].cell.isWorker = false;
				me.level[me.worker_y - 1][me.worker_x].cell.isWorker = true;
				me.level[me.worker_y - 1][me.worker_x].cell.isCrate = false;
				me.level[me.worker_y - 2][me.worker_x].cell.isCrate = true;
				me.updateLevelElement();
			}
		} else if (me.canMoveOver(me.level[me.worker_y - 1][me.worker_x].cell.type)) {
			me.level[me.worker_y][me.worker_x].cell.isWorker = false;
			me.level[me.worker_y - 1][me.worker_x].cell.isWorker = true;
			me.updateLevelElement();
		}
	},

	handleRightClick: function () {
		let me = this;
		if (me.level.length === 0
			|| me.worker_x + 1 >= me.level_width) return;
		me.worker_orientation = 'r';
		if (me.level[me.worker_y][me.worker_x + 1].cell.isCrate) {
			if (me.worker_x + 2 >= me.level_width) return;
			if (!me.level[me.worker_y][me.worker_x + 2].cell.isCrate
				&& me.canMoveOver(me.level[me.worker_y][me.worker_x + 2].cell.type)) {
				me.level[me.worker_y][me.worker_x].cell.isWorker = false;
				me.level[me.worker_y][me.worker_x + 1].cell.isWorker = true;
				me.level[me.worker_y][me.worker_x + 1].cell.isCrate = false;
				me.level[me.worker_y][me.worker_x + 2].cell.isCrate = true;
				me.updateLevelElement();
			}
		} else if (me.canMoveOver(me.level[me.worker_y][me.worker_x + 1].cell.type)) {
			me.level[me.worker_y][me.worker_x].cell.isWorker = false;
			me.level[me.worker_y][me.worker_x + 1].cell.isWorker = true;
			me.updateLevelElement();
		}
	},

	handleBottomClick: function () {
		let me = this;
		if (me.level.length === 0
			|| me.worker_y + 1 >= me.level_height) return;
		me.worker_orientation = 'b';
		if (me.level[me.worker_y + 1][me.worker_x].cell.isCrate) {
			if (me.worker_y + 2 >= me.level_height) return;
			if (!me.level[me.worker_y + 2][me.worker_x].cell.isCrate
				&& me.canMoveOver(me.level[me.worker_y + 2][me.worker_x].cell.type)) {
				me.level[me.worker_y][me.worker_x].cell.isWorker = false;
				me.level[me.worker_y + 1][me.worker_x].cell.isWorker = true;
				me.level[me.worker_y + 1][me.worker_x].cell.isCrate = false;
				me.level[me.worker_y + 2][me.worker_x].cell.isCrate = true;
				me.updateLevelElement();
			}
		} else if (me.canMoveOver(me.level[me.worker_y + 1][me.worker_x].cell.type)) {
			me.level[me.worker_y][me.worker_x].cell.isWorker = false;
			me.level[me.worker_y + 1][me.worker_x].cell.isWorker = true;
			me.updateLevelElement();
		}
	},

	canMoveOver: function (targetType) {
		return ['floor', 'pallet', 'start', 'finish'].indexOf(targetType) > -1;
	},

	setupLevel: function () {
		let me = this;
		me.level = [];
		if (me.custom_level !== null) {
			me.level_hash = decompress(me.custom_level.hash);
			me.level_name = me.custom_level.name;
			me.level_width = me.custom_level.width;
			me.level_height = me.custom_level.height;
		} else {
			me.level_hash = decompress(me.level_array[me.level_id].hash);
			me.level_name = me.level_array[me.level_id].name;
			me.level_width = me.level_array[me.level_id].width;
			me.level_height = me.level_array[me.level_id].height;
		}
		for (let y = 0; y < me.level_height; y++) {
			let newRow = [];
			for (let x = 0; x < me.level_width; x++) {
				let type = me.getCellType(me.level_hash.charAt(y * me.level_width + x));
				if (type === 'crate') {
					newRow.push({
						cell: {
							type: 'floor',
							isWorker: false,
							isCrate: true
						}
					});
				} else if (type === 'stack') {
					newRow.push({
						cell: {
							type: 'pallet',
							isWorker: false,
							isCrate: true
						}
					});
				} else {
					newRow.push({
						cell: {
							type,
							isWorker: type === 'start',
							isCrate: false
						}
					});
				}
			}
			me.level.push(newRow);
		}
		me.ignore_keyboard = false;
	},

	findWorker: function () {
		let me = this;
		for (let y = 0; y < me.level_height; y++) {
			for (let x = 0; x < me.level_width; x++) {
				if (me.level[y][x].cell.isWorker) {
					me.worker_x = x;
					me.worker_y = y;
					return;
				}
			}
		}
	},

	didIWin: function () {
		let me = this;
		if (me.checkForWin()) {
			me.ignore_keyboard = true;
			me.$win_dialog
				.dialog({
					beforeClose: function () {
						me.recordLevelProgress();
						if (me.custom_level !== null) {
							me.custom_level = null;
						} else {
							if (me.level_id + 1 < me.level_array.length) {
								me.level_id++;
							} else {
								me.level_id = 0;
							}
						}
						me.$level_select.val(me.level_id);
						me.level_steps_current = -1;
						me.getCookies();
						me.consumeCookies();
						me.updateNumberOfSteps();
						me.setupLevel();
						me.updateLevelElement();
					},
					buttons: [
						{
							modal: true,
							text: 'Ok',
							click: function () {
								$(this).dialog("close");
							}
						}
					],
					dialogClass: 'ibm-font',
					open: function () {
						let step_message = `You took ${me.level_steps_current} steps!`;
						if (me.level_steps_best > me.level_steps_current) {
							step_message += `<br />You've beaten your previous record of ${me.level_steps_best} steps!`;
						} else if (me.level_steps_best == me.level_steps_current) {
							step_message += "<br />Looks like you've done this before!";
						} else if (me.level_steps_best > 0) {
							step_message += `<br />Your current record is ${me.level_steps_best} steps. Do you think you can do better?`;
						} else {
							step_message += "<br />You have set a new record!";
						}
						$(this).find("p.step-message").html(step_message);
					},
					modal: true,
					title: `Congratulations! You have completed ${me.level_name}!`,
					width: 535
				}
			);
		}
	},

	recordLevelProgress: function () {
		let me = this;
		let current_level_record = {
			"md5": (me.custom_level !== null) // this logic is to operate on compressed hashes only
				? md5(me.custom_level.hash) 
				: md5(me.level_array[me.level_id].hash),
			"steps": me.level_steps_current
		};
		for (let i = 0; i < me.completed_levels.length; i++) {
			if (me.completed_levels[i].md5 === current_level_record.md5) {
				if (me.completed_levels[i].steps > current_level_record.steps) {
					me.completed_levels[i] = current_level_record;
				}
				current_level_record = null;
				break;
			}
		}
		if (current_level_record !== null) {
			me.completed_levels.push(current_level_record);
		}
		me.setCookie("completedLevels", "", -1);
		me.setCookie("completedLevels", JSON.stringify(me.completed_levels), 365);
	},

	updateNumberOfSteps: function () {
		let me = this;
		me.$current_number_of_steps.text(me.level_steps_current);
		me.$best_number_of_steps.text(me.level_steps_best);
	},

	checkForWin: function () {
		let me = this;
		for (let y = 0; y < me.level_height; y++) {
			for (let x = 0; x < me.level_width; x++) {
				if (me.level[y][x].cell.isCrate && me.level[y][x].cell.type !== 'pallet') {
					return false;
				}
			}
		}
		return true;
	},

	getCellType: function (hashType) {
		switch (hashType) {
			case 'F':
				return 'floor';
			case 'W':
				return 'wall';
			case 'P':
				return 'pallet';
			case 'C':
				return 'crate'; // crate on the floor
			case 'G':
				return 'stack'; // crate on the pallet
			case 'S':
				return 'start';
			case 'E':
				return 'floor';
		}
	},

	updateLevelElement: function () {
		let me = this;
		me.level_steps_current++;
		me.updateNumberOfSteps();
		me.$level_element
			.empty()
			.css({
				"width": me.level_width * 16 + "px",
				"transform": "scale(1)"
			});
		for (let y = 0; y < me.level_height; y++) {
			let $newRow = $("<div />")
				.addClass("level-row")
				.attr("id", "row-" + y)
				.data("row", y)
				.css("width", me.level_width * 16 + "px");
			for (let x = 0; x < me.level_width; x++) {
				let classArray = ["level-cell"];
				switch (me.level[y][x].cell.type) {
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
					case "finish":
						classArray.push("floor");
						break;
				}
				if (me.level[y][x].cell.isCrate) {
					classArray.push("crate");
				} else if (me.level[y][x].cell.isWorker) {
					classArray.push(`worker-${me.worker_orientation}`);
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
		me.scaleLevel();
		me.findWorker();
		me.didIWin();
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