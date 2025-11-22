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

		// AI settings
		this.aiDifficulty = 'medium'; // 'easy' | 'medium' | 'hard' | 'insane'
		this.aiTimeLimitMs = 1000; // ms time budget for 'insane' iterative deepening
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
		const aiParam = this.getUrlParameter("ai");
		this.aiDifficulty = (aiParam === false) ? this.aiDifficulty : aiParam;
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

	boardCopy(board) {
		return board.map(function (row) { return row.map(function (c) { return ({ player: c.player }); }); });
	}

	getAvailableMoves(board) {
		const moves = [];
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[0].length; x++) {
				if (board[y][x].player === null) moves.push({ x: x, y: y });
			}
		}
		return moves;
	}

	isWinFor(board, width, height, winLen, player) {
		const dirs = [ {x:1,y:0}, {x:0,y:1}, {x:1,y:1}, {x:1,y:-1} ];
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (board[y][x].player !== player) continue;
				for (let d = 0; d < dirs.length; d++) {
					let dx = dirs[d].x, dy = dirs[d].y;
					let cx = x, cy = y, count = 0;
					while (cx >= 0 && cx < width && cy >= 0 && cy < height && board[cy][cx].player === player) {
						count++;
						if (count >= winLen) return true;
						cx += dx; cy += dy;
					}
				}
			}
		}
		return false;
	}

	evaluateBoard(board, width, height, winLen, playerId) {
		const oppId = (playerId + 1) % this.fieldPlayers;
		let score = 0;
		const dirs = [ {x:1,y:0}, {x:0,y:1}, {x:1,y:1}, {x:1,y:-1} ];
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				for (let d = 0; d < dirs.length; d++) {
					let dx = dirs[d].x, dy = dirs[d].y;
					let countP = 0, countO = 0, empties = 0;
					for (let k = 0; k < winLen; k++) {
						let cx = x + k * dx, cy = y + k * dy;
						if (cx < 0 || cx >= width || cy < 0 || cy >= height) { empties = -1; break; }
						const v = board[cy][cx].player;
						if (v === playerId) countP++; else if (v === oppId) countO++; else empties++;
					}
					if (empties === -1) continue;
					if (countO === 0 && countP > 0) score += Math.pow(10, countP);
					if (countP === 0 && countO > 0) score -= Math.pow(10, countO);
				}
			}
		}
		return score;
	}

	minimax(board, width, height, winLen, depth, alpha, beta, maximizingPlayer, playerId, originalPlayerId) {
		const moves = this.getAvailableMoves(board);
		if (this.isWinFor(board, width, height, winLen, originalPlayerId)) return { score: Infinity };
		const oppId = (originalPlayerId + 1) % this.fieldPlayers;
		if (this.isWinFor(board, width, height, winLen, oppId)) return { score: -Infinity };
		if (moves.length === 0) return { score: 0 };
		if (depth === 0) {
			const val = this.evaluateBoard(board, width, height, winLen, originalPlayerId);
			return { score: val };
		}
		let bestMove = null;
		if (maximizingPlayer) {
			let value = -Infinity;
			for (let i = 0; i < moves.length; i++) {
				const m = moves[i];
				board[m.y][m.x].player = playerId;
				const res = this.minimax(board, width, height, winLen, depth - 1, alpha, beta, false, (playerId + 1) % this.fieldPlayers, originalPlayerId);
				board[m.y][m.x].player = null;
				if (res.score > value) { value = res.score; bestMove = m; }
				alpha = Math.max(alpha, value);
				if (alpha >= beta) break;
			}
			return { score: value, move: bestMove };
		} else {
			let value = Infinity;
			for (let i = 0; i < moves.length; i++) {
				const m = moves[i];
				board[m.y][m.x].player = playerId;
				const res = this.minimax(board, width, height, winLen, depth - 1, alpha, beta, true, (playerId + 1) % this.fieldPlayers, originalPlayerId);
				board[m.y][m.x].player = null;
				if (res.score < value) { value = res.score; bestMove = m; }
				beta = Math.min(beta, value);
				if (alpha >= beta) break;
			}
			return { score: value, move: bestMove };
		}
	}

	computeMove() {
		const width = this.fieldWidth;
		const height = this.fieldHeight;
		const winLen = this.fieldWin;
		const board = this.boardCopy(this.field);
		const playerId = this.currentPlayer;
		const moves = this.getAvailableMoves(board);
		if (moves.length === 0) return null;
		if (this.aiDifficulty === 'easy') return moves[Math.floor(Math.random() * moves.length)];
		for (let i = 0; i < moves.length; i++) {
			const m = moves[i]; board[m.y][m.x].player = playerId;
			if (this.isWinFor(board, width, height, winLen, playerId)) { board[m.y][m.x].player = null; return m; }
			board[m.y][m.x].player = null;
		}
		const oppId = (playerId + 1) % this.fieldPlayers;
		for (let i = 0; i < moves.length; i++) {
			const m = moves[i]; board[m.y][m.x].player = oppId;
			if (this.isWinFor(board, width, height, winLen, oppId)) { board[m.y][m.x].player = null; return m; }
			board[m.y][m.x].player = null;
		}
		let depth = 3;
		if (this.aiDifficulty === 'medium') depth = Math.min(4, moves.length, 4);
		if (this.aiDifficulty === 'hard') depth = (width * height <= 9) ? moves.length : Math.min(6, moves.length);
		if (this.aiDifficulty === 'insane') {
			const start = Date.now(); let best = null;
			for (let d = 1; d <= moves.length; d++) {
				const res = this.minimax(board, width, height, winLen, d, -Infinity, Infinity, true, playerId, playerId);
				if (res.move) best = res.move;
				if (Date.now() - start > this.aiTimeLimitMs) break;
			}
			if (best) return best;
			depth = Math.min(6, moves.length);
		}
		const result = this.minimax(board, width, height, winLen, depth, -Infinity, Infinity, true, playerId, playerId);
		if (result && result.move) return result.move;
		return moves[Math.floor(Math.random() * moves.length)];
	}

	computerMove() {
		if (this.fieldPlayers > 1 && this.computerPlayers.includes(this.currentPlayer)) {
			const mv = this.computeMove();
			if (mv) this.makeMove(mv.x, mv.y);
		}
	}

	static CreateInstance(settings) {
		const instance = new Main();
		instance.initialize(settings);
	}
}