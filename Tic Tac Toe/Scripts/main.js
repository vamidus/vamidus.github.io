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
			this.setupLegend();
			this.setupScoreBoard();
		}
	}
	setupLegend() {
		var $legend = $("<table />");
		var $row = $("<tr />");
		$("<td />").html("Current&nbsp;player:").appendTo($row);
		$("<td />").attr("id", "current").attr("player", 0).appendTo($row);
		$row.appendTo($legend);
		$legend.addClass("legend").appendTo(this.$field);
	}
	setupScoreBoard() {
	}
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
		if (this.countMyCells(x, y - 1, 0, -1, this.currentPlayer) + this.countMyCells(x, y + 1, 0, 1, this.currentPlayer) + 1 >= this.fieldWin // W-E
			|| this.countMyCells(x - 1, y, -1, 0, this.currentPlayer) + this.countMyCells(x + 1, y, 1, 0, this.currentPlayer) + 1 >= this.fieldWin // N-S
			|| this.countMyCells(x - 1, y - 1, -1, -1, this.currentPlayer) + this.countMyCells(x + 1, y + 1, 1, 1, this.currentPlayer) + 1 >= this.fieldWin // NW-SE
			|| this.countMyCells(x + 1, y - 1, 1, -1, this.currentPlayer) + this.countMyCells(x - 1, y + 1, -1, 1, this.currentPlayer) + 1 >= this.fieldWin) { // NE-SW
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
		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				if (this.field[y][x].player === null) {
					if (this.countMyCells(x, y - 1, 0, -1, player) + this.countMyCells(x, y + 1, 0, 1, player) + 1 >= this.fieldWin // W-E
						|| this.countMyCells(x - 1, y, -1, 0, player) + this.countMyCells(x + 1, y, 1, 0, player) + 1 >= this.fieldWin // N-S
						|| this.countMyCells(x - 1, y - 1, -1, -1, player) + this.countMyCells(x + 1, y + 1, 1, 1, player) + 1 >= this.fieldWin // NW-SE
						|| this.countMyCells(x + 1, y - 1, 1, -1, player) + this.countMyCells(x - 1, y + 1, -1, 1, player) + 1 >= this.fieldWin) { // NE-SW
						this.makeMove(x, y);
						return true;
					}
				}
			}
		}
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