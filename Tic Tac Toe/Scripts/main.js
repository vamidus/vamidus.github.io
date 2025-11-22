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

		// Selectors
		this.$setup = null; // setup form
		this.$field = null; // DOM representation of the playing field
		this.$winner = null; // win message
		this.$draw = null; // draw message
		this.$loser = null; // lose message
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
	}
	initConfigs() {
		this.fieldWidth = this.getUrlParameter("width") - 0;
		this.fieldHeight = this.getUrlParameter("height") - 0;
		this.fieldPlayers = this.getUrlParameter("players") - 0;
		this.fieldWin = this.getUrlParameter("win") - 0;
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
		const query = window.location.search.substring(1);
		const parameters = query.split("&");

		for (let i = 0; i < parameters.length; i++) {
			const parameter = parameters[i].split("=");
			if (parameter[0] === paramName) {
				return parameter[1] === undefined ? true : decodeURIComponent(parameter[1]);
			}
		}
		return false;
	}
	setupField() {
		if (this.fieldPlayers > 0) {
			this.$field.empty();
			const $table = $("<table />");
			for (let y = 0; y < this.fieldHeight; y++) {
				const $row = $("<tr />");
				let fieldRow = [];
				for (let x = 0; x < this.fieldWidth; x++) {
					$("<td />")
						.attr("x", x)
						.attr("y", y)
						.appendTo($row);
					fieldRow.push({ player: null });
				}
				$row.appendTo($table);
				this.field.push(fieldRow);
			}
			$table.appendTo(this.$field);
			$("<div />").attr("id", "strike").appendTo(this.$field);
		}
	}
	setupClickHandlers() {
		if (this.fieldPlayers > 0) {
			const me = this;
			this.$field
				.find("td")
				.click(me.fieldClickHandler.bind(me));
		}
	}
	fieldClickHandler(event) {
		let x = $(event.target).attr("x") - 0;
		let y = $(event.target).attr("y") - 0;
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
		let winningCombination = this.getWinningCombination(x, y);
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
		const directions = [
			{ x: 0, y: -1 }, // N
			{ x: 1, y: 0 }, // E
			{ x: 1, y: -1 }, // NE
			{ x: 1, y: 1 } // SE
		];

		for (let i = 0; i < directions.length; i++) {
			const dir = directions[i];
			let line = this.getCellsInARow(x, y, dir.x, dir.y, this.currentPlayer)
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
		const result = [{ x: x, y: y }];
		return result.concat(this.getCellsInARow(x + dirX, y + dirY, dirX, dirY, player));
	}
	drawWinningLine(combination) {
		const fieldOffset = this.$field.offset();
		let maxDist = -1, idxA = 0, idxB = 0;
		for (let i = 0; i < combination.length; i++) {
			for (let j = i + 1; j < combination.length; j++) {
				const dx = combination[i].x - combination[j].x;
				const dy = combination[i].y - combination[j].y;
				const dist = dx * dx + dy * dy;
				if (dist > maxDist) {
					maxDist = dist;
					idxA = i;
					idxB = j;
				}
			}
		}
		const cellA = this.$field.find('td[x="' + combination[idxA].x + '"][y="' + combination[idxA].y + '"]');
		const cellB = this.$field.find('td[x="' + combination[idxB].x + '"][y="' + combination[idxB].y + '"]');
		const cellAOffset = cellA.offset();
		const cellBOffset = cellB.offset();
		function getCellCenter(cell, cellOffset, fieldOffset) {
			const style = window.getComputedStyle(cell[0]);
			const borderLeft = parseFloat(style.borderLeftWidth) || 1.5;
			const borderTop = parseFloat(style.borderTopWidth) || 1.5;
			return {
				x: cellOffset.left - fieldOffset.left + cell.width() / 2 + borderLeft,
				y: cellOffset.top - fieldOffset.top + cell.height() / 2 + borderTop
			};
		}
		const cellACenter = getCellCenter(cellA, cellAOffset, fieldOffset);
		const cellBCenter = getCellCenter(cellB, cellBOffset, fieldOffset);
		const angle = Math.atan2(cellBCenter.y - cellACenter.y, cellBCenter.x - cellACenter.x) * 180 / Math.PI;
		const length = Math.sqrt(Math.pow(cellBCenter.x - cellACenter.x, 2) + Math.pow(cellBCenter.y - cellACenter.y, 2));
		const $strike = this.$field.find("#strike");
		const strikeHeight = $strike.outerHeight() || 0;
		const winningPlayer = this.field[combination[0].y][combination[0].x].player;
		const playerColors = [
			'red',    // 0
			'blue',   // 1
			'yellow', // 2
			'green',  // 3
			'aqua',   // 4
			'fuchsia' // 5
		];
		const strikeColor = playerColors[winningPlayer] || 'black';
		$strike.css({
			width: (length + strikeHeight) + 'px',
			top: (cellACenter.y - strikeHeight / 2) + 'px',
			left: (cellACenter.x - strikeHeight / 2) + 'px',
			transform: "rotate(" + angle + "deg)",
			"transform-origin": (strikeHeight / 2) + 'px ' + (strikeHeight / 2) + 'px',
			display: "block",
			"background-color": strikeColor
		});
	}
	nextPlayer() {
		this.currentPlayer = (this.currentPlayer + 1 === this.fieldPlayers) ? 0 : this.currentPlayer + 1;
		$("#current").attr("player", this.currentPlayer);
		this.computerMove();
	}
	isDraw() {
		for (let y = 0; y < this.fieldHeight; y++) {
			for (let x = 0; x < this.fieldWidth; x++) {
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
		for (let player = 0; player < this.fieldPlayers; player++) {
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
		const originalPlayer = this.currentPlayer;
		this.currentPlayer = player;

		for (let y = 0; y < this.fieldHeight; y++) {
			for (let x = 0; x < this.fieldWidth; x++) {
				if (this.field[y][x].player === null) {
					this.field[y][x].player = player;
					let winningCombination = this.getWinningCombination(x, y);
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
		const centerX = Math.floor((this.fieldWidth - 1) / 2);
		const centerY = Math.floor((this.fieldHeight - 1) / 2);
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
		let y = 0;
		let x = 0;
		do {
			y = Math.floor(Math.random() * this.fieldHeight);
			x = Math.floor(Math.random() * this.fieldWidth);
		}
		while (this.field[y][x].player !== null);
		this.makeMove(x, y);
	}
	static CreateInstance(settings) {
		const instance = new Main();
		instance.initialize(settings);
	}
}