class Main {
	constructor() {
		// Configs
		this.fieldWidth = 0; // max x + 1
		this.fieldHeight = 0; // max y + 1
		this.fieldWin = 0; // least fields captured in a row to win
		this.fieldPlayers = 0; // max players - 1


		//this.computerPlayers = []; // players to use AI
		//this.computerPlayers = [0, 1, 2, 3, 4, 5]; // players to use AI
		this.computerPlayers = [0]; // players to use AI



		//this.computerPlayers = [1, 3, 5]; // players to use AI
		// Variables
		this.field = []; // array representing the playing filed
		this.currentPlayer = 0; // currint player id
		this.scores = []; // scoreboard winnigs


		// Selectors
		this.$setup = null; // setup form
		this.$field = null; // DOM representation of the playing field
		this.$winner = null; // win message
		this.$draw = null; // draw message
		this.$loser = null; // lose message
		this.$scoreBoard = null; // scorboard container
	}
	initialize(settings) {
		if (settings) this.applySettings(settings);
		this.setup();
	}
	applySettings(settings) {
		$.extend(this, settings);
	}
	setup() {
		this.setupElementSelectors();
		this.initConfigs();
		this.initVisibility();
		this.setupField();
		this.setupClickHandlers();
		this.computerMove();
	}
	setupElementSelectors() {
		this.$setup = $("form[name='setup']");
		this.$field = $("#field");
		this.$winner = $("#winner");
		this.$draw = $("#draw");
		this.$loser = $("#loser");
		this.$scoreBoard = $("#score-board");
	}
	initConfigs() {
		this.fieldWidth = this.getUrlParameter("width") - 0;
		this.fieldHeight = this.getUrlParameter("height") - 0;
		this.fieldWin = this.getUrlParameter("win") - 0;
		this.fieldPlayers = this.getUrlParameter("players") - 0;
		this.scores = this.getUrlParameter("scores");
	}
	initVisibility() {
		if (this.fieldPlayers > 1) {
			this.$setup.hide();
			this.$field.show();
		}
		else {
			this.$setup.show();
			this.$field.hide();
		}
	}
	getUrlParameter(paramName) {
		var query = window.location.search.substring(1);
		var parameters = query.split("&");

		for (var i = 0; i < parameters.length; i++) {
			var parameter = parameters[i].split("=");
			if (parameter[0] === paramName) {
				return parameter[1] === undefined ? true : decodeURIComponent(parameter[1]);
			}
		}
		return false;
	}
	setupField() {
		if (this.fieldPlayers > 0) {
			this.$field.empty();
			var $table = $("<table />");
			for (var y = 0; y < this.fieldHeight; y++) {
				var $row = $("<tr />");
				var fieldRow = [];
				for (var x = 0; x < this.fieldWidth; x++) {
					$("<td />")
						.attr("x", x)
						.attr("y", y)
						.appendTo($row);
					fieldRow.push({
						player: null
					});
				}
				$row.appendTo($table);
				this.field.push(fieldRow);
			}
			$table.appendTo(this.$field);
			$("<div />").attr("id", "strike").appendTo(this.$field);
			//this.setupLegend();
			//this.setupScoreBoard();
		}
	}
	// setupLegend() {
	// 	var $legend = $("<table />");
	// 	var $row = $("<tr />");
	// 	$("<td />").html("Current&nbsp;player:").appendTo($row);
	// 	$("<td />").attr("id", "current").attr("player", 0).appendTo($row);
	// 	$row.appendTo($legend);
	// 	$legend.addClass("legend").appendTo(this.$field);
	// }
	// setupScoreBoard() {
	// }
	setupClickHandlers() {
		if (this.fieldPlayers > 0) {
			var me = this;
			this.$field
				.find("td")
				.click(me.fieldClickHandler.bind(me));
		}
	}
	fieldClickHandler(event) {
		var x = $(event.target).attr("x") - 0;
		var y = $(event.target).attr("y") - 0;
		if (x > -1 && y > -1) {
			if (this.field[y][x].player === null) {
				this.makeMove(x, y);
			}
		}
	}
	makeMove(x, y) {
		this.field[y][x].player = this.currentPlayer;
		this.$field
			.find("td[x=" + x + "][y=" + y + "]")
			.attr("player", this.currentPlayer);
		var winningCombination = this.getWinningCombination(x, y);
		if (winningCombination) {
			this.drawWinningLine(winningCombination);
			if (this.computerPlayers.includes(this.currentPlayer)) {
				this.$loser.show().addClass("show");
			}
			else {
				this.$winner.show().addClass("show");
			}
			this.$field.find("td").off();
		}
		else if (this.isDraw()) {
			this.$draw.show().addClass("show");
			this.$field.find("td").off();
		}
		else {
			this.nextPlayer();
		}
	}
	countMyCells(x, y, dirX, dirY, player) {
		if (x < 0 || x >= this.fieldWidth
			|| y < 0 || y >= this.fieldHeight
			|| this.field[y][x].player !== player) {
			return 0;
		}
		return 1 + this.countMyCells(x + dirX, y + dirY, dirX, dirY, player);
	}
	getWinningCombination(x, y) {
		var directions = [
			{ x: 0, y: -1 }, // N
			{ x: 1, y: 0 }, // E
			{ x: 1, y: -1 }, // NE
			{ x: 1, y: 1 } // SE
		];

		for (var i = 0; i < directions.length; i++) {
			var dir = directions[i];
			var line = this.getCellsInARow(x, y, dir.x, dir.y, this.currentPlayer)
				.concat(this.getCellsInARow(x, y, -dir.x, -dir.y, this.currentPlayer).slice(1));

			if (line.length >= this.fieldWin) {
				return line;
			}
		}

		return null;
	}

	getCellsInARow(x, y, dirX, dirY, player) {
		if (x < 0 || x >= this.fieldWidth || y < 0 || y >= this.fieldHeight || this.field[y][x].player !== player) {
			return [];
		}
		var result = [{ x: x, y: y }];
		return result.concat(this.getCellsInARow(x + dirX, y + dirY, dirX, dirY, player));
	}

	drawWinningLine(combination) {
		// Find the two farthest-apart cells in the combination
		var fieldOffset = this.$field.offset();
		var maxDist = -1, idxA = 0, idxB = 0;
		for (var i = 0; i < combination.length; i++) {
			for (var j = i + 1; j < combination.length; j++) {
				var dx = combination[i].x - combination[j].x;
				var dy = combination[i].y - combination[j].y;
				var dist = dx * dx + dy * dy;
				if (dist > maxDist) {
					maxDist = dist;
					idxA = i;
					idxB = j;
				}
			}
		}
		var cellA = this.$field.find('td[x="' + combination[idxA].x + '"][y="' + combination[idxA].y + '"]');
		var cellB = this.$field.find('td[x="' + combination[idxB].x + '"][y="' + combination[idxB].y + '"]');
		var cellAOffset = cellA.offset();
		var cellBOffset = cellB.offset();
		var cellACenter = {
			x: cellAOffset.left - fieldOffset.left + cellA.width() / 2 + 3,
			y: cellAOffset.top - fieldOffset.top + cellA.height() / 2 + 3
		};
		var cellBCenter = {
			x: cellBOffset.left - fieldOffset.left + cellB.width() / 2 + 3,
			y: cellBOffset.top - fieldOffset.top + cellB.height() / 2 + 3
		};
		var angle = Math.atan2(cellBCenter.y - cellACenter.y, cellBCenter.x - cellACenter.x) * 180 / Math.PI;
		var length = Math.sqrt(Math.pow(cellBCenter.x - cellACenter.x, 2) + Math.pow(cellBCenter.y - cellACenter.y, 2));
		var $strike = this.$field.find("#strike");
		$strike.css({
			width: length,
			top: cellACenter.y,
			left: cellACenter.x,
			transform: "rotate(" + angle + "deg)",
			"transform-origin": "0 0",
			display: "block"
		});
	}
	nextPlayer() {
		this.currentPlayer = (this.currentPlayer + 1 === this.fieldPlayers) ? 0 : this.currentPlayer + 1;
		$("#current").attr("player", this.currentPlayer);
		this.computerMove();
	}
	isDraw() {
		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				if (this.field[y][x].player === null) {
					return false;
				}
			}
		}
		return true;
	}
	computerMove() {
		if (this.fieldPlayers > 1 && this.computerPlayers.includes(this.currentPlayer)) {
			this.win3x3();
		}
	}
	win3x3() {
		for (var player = 0; player < this.fieldPlayers; player++) {
			if (this.checkFill(player)) {
				return;
			}
		}
		if (this.blindHoard(1)) {
			return;
		}
		else if (this.blindHoard(2)) {
			return;
		}
		else if (this.blindHoard(3)) {
			return;
		}
		this.randomMove();
	}
	checkFill(player) {
		var originalPlayer = this.currentPlayer;
		this.currentPlayer = player;

		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				if (this.field[y][x].player === null) {
					this.field[y][x].player = player;
					var winningCombination = this.getWinningCombination(x, y);
					this.field[y][x].player = null;

					if (winningCombination) {
						this.currentPlayer = originalPlayer;
						this.makeMove(x, y);
						return true;
					}
				}
			}
		}
		this.currentPlayer = originalPlayer;
		return false;
	}
	blindHoard(r) {
		var centerX = Math.floor((this.fieldWidth - 1) / 2);
		var centerY = Math.floor((this.fieldHeight - 1) / 2);
		if (this.checkComputerMove(centerX, centerY)) { // checking this doesn't make much sense after the corner checks
			return true; // center
		}
		if (this.checkComputerMove(centerX - r, centerY - r)) {
			return true; // NW
		}
		if (this.checkComputerMove(centerX + r, centerY + r)) {
			return true; // SE
		}
		if (this.checkComputerMove(centerX + r, centerY - r)) {
			return true; // NE
		}
		if (this.checkComputerMove(centerX - r, centerY + r)) {
			return true; // SW
		}
		if (this.checkComputerMove(centerX, centerY - r)) {
			return true; // N
		}
		if (this.checkComputerMove(centerX, centerY + r)) {
			return true; // S
		}
		if (this.checkComputerMove(centerX + r, centerY)) {
			return true; // E
		}
		if (this.checkComputerMove(centerX - r, centerY)) {
			return true; // W
		}
		return false;
	}
	checkComputerMove(x, y) {
		if (x < 0 || x >= this.fieldWidth
			|| y < 0 || y >= this.fieldHeight
			|| this.field[y][x].player !== null) {
			return false;
		}
		this.makeMove(x, y);
		return true;
	}
	randomMove() {
		var y = 0;
		var x = 0;
		do {
			y = Math.floor(Math.random() * this.fieldHeight);
			x = Math.floor(Math.random() * this.fieldWidth);
		}
		while (this.field[y][x].player !== null);
		this.makeMove(x, y);
	}
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}