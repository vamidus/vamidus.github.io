class Main {
	constructor() {
		// Configs
		this.square_size = 64;
		this.square_black = "grey";
		this.square_white = "white";

		// Variables
		this.aiIsBlack = true;

		this.board_height = 8;
		this.board_width = 8;

		this.class_black = "black";
		this.class_white = "white";
		this.class_legend = "legend";
		this.class_square = "square";
		this.class_rank = "rank";

		this.pieces = ["♔♕♖♗♘♙", "♚♛♜♝♞♟︎"];
		this.square_files = "abcdefgh";
		this.square_ranks = "87654321";

		this.scale_range = 1 / 720;

		this.state = null;
		this.player_type = ["Human", "Computer"];
		this.current_player_types = [0, 0];
		this.depth = 0;

		this.dragged_from_square = "";
		this.dragged_over_square = "";
		this.selected_square = "";
		this.selected_square_node = null;
		
		this.lastMoveWhite = null;
		this.lastMoveBlack = null;

		this.timeout_handle = null;

		this.moveHistory = [];		

		// Selectors
		// Map p4wn engine piece types to their character index in this.pieces strings
		// P4_PAWN, P4_ROOK, etc. are global constants from engine.js
		this.pieceCharIndexMap = {
			2: 5,   // P4_PAWN -> ♙ / ♟︎ (index 5 in "♔♕♖♗♘♙" and "♚♛♜♝♞♟︎")
			4: 2,   // P4_ROOK -> ♖ / ♜ (index 2)
			6: 4,   // P4_KNIGHT -> ♘ / ♞ (index 4)
			8: 3,   // P4_BISHOP -> ♗ / ♝ (index 3)
			10: 0,  // P4_KING -> ♔ / ♚ (index 0)
			12: 1   // P4_QUEEN -> ♕ / ♛ (index 1)
		};
		this.$board = null;
		this.$menuIcon = null;
		this.$menu = null;
	}
	
	initialize(settings) {
		if (settings) this.applySettings(settings);
		this.setup();

		// Color scheme
		const preferredScheme = this.getPreferredColorScheme();
		this.setColorScheme(preferredScheme);
		$(`#${preferredScheme}-scheme`).prop('checked', true);

		// Difficulty
		const difficulty = this.getDifficulty();
		this.$difficultySlider.val(difficulty);

		// Highlighting
		const highlighting = this.getHighlighting();
		this.$highlightSwitch.prop('checked', highlighting);
		this.setHighlighting(highlighting);

		this.startNewGame();
	}

	applySettings(settings) {
		$.extend(this, settings);
	}

	setup() {
		this.setupElementSelectors();
		this.setupEventListeners();
		this.setCssVariables();
		this.scaleBoard();
		this.setupBoard();
	}

	setupElementSelectors() {
		this.$board = $(".board:first");
		this.$menuIcon = $("#menu-icon");
		this.$menuContainer = $(".menu-container");
		this.$menu = $(".menu");
		this.$okButton = $("#ok-button");
		this.$difficultySlider = $("#difficulty-slider");
		this.$newGameButton = $("#new-game-button");
		this.$highlightSwitch = $("#highlight-switch");
		this.$moveHistoryBody = $("#move-history-body");
		this.$moveHistoryContainer = $(".move-history-container");
		this.$gameStateTextarea = $("#game-state-textarea");
		this.$exportGameStateButton = $("#export-game-state-button");
		this.$importGameStateButton = $("#import-game-state-button");
	}

	setupEventListeners() {
		$(window).on("resize", this.scaleBoard.bind(this));
		this.$menuIcon.on("click", () => {
			this.$menuContainer.toggleClass("open");
		});
		this.$okButton.on("click", () => {
			this.$menuContainer.removeClass("open");
		});
		this.$menuContainer.on("click", (e) => {
			if (e.target === this.$menuContainer[0]) {
				this.$menuContainer.removeClass("open");
			}
		});
		this.$newGameButton.on("click", () => {
			this.startNewGame();
			this.$menuContainer.removeClass("open");
		});
		$('input[name="color-scheme"]').on('change', (e) => {
			this.setColorScheme(e.target.id.split('-')[0]);
		});
		this.$difficultySlider.on('input', (e) => {
			this.depth = e.target.value;
			localStorage.setItem('difficulty', this.depth);
		});
		this.$highlightSwitch.on('change', (e) => {
			this.setHighlighting(e.target.checked);
		});
		this.$board.on("click", ".square", (e) => this.handleSquareClick(e.currentTarget));
		this.$exportGameStateButton.on("click", () => this.exportGameState());
		this.$importGameStateButton.on("click", () => this.importGameState());
	}

	setColorScheme(scheme) {
		const root = document.documentElement;
		if (scheme === 'auto') {
			root.classList.remove('light-theme', 'dark-theme');
			localStorage.removeItem('color-scheme');
		} else {
			root.classList.remove('light-theme', 'dark-theme');
			root.classList.add(scheme + '-theme');
			localStorage.setItem('color-scheme', scheme);
		}
	}

	getPreferredColorScheme() {
		const savedScheme = localStorage.getItem('color-scheme');
		if (savedScheme) {
			return savedScheme;
		} else {
			return 'auto';
		}
	}

	getDifficulty() {
		const savedDifficulty = localStorage.getItem('difficulty');
		if (savedDifficulty) {
			return parseInt(savedDifficulty, 10);
		} else {
			return 0; // Easy
		}
	}

	getHighlighting() {
		const savedHighlighting = localStorage.getItem('highlighting');
		if (savedHighlighting) {
			return savedHighlighting === 'true';
		} else {
			return true; // Default to true
		}
	}

	setHighlighting(enabled) {
		localStorage.setItem('highlighting', enabled);
		if (enabled) {
			this.$board.removeClass('no-highlight');
		} else {
			this.$board.addClass('no-highlight');
		}
	}

	setCssVariables() {
		document.documentElement.style.setProperty("--square-black", this.square_black);
		document.documentElement.style.setProperty("--square-white", this.square_white);
	}

	scaleBoard() {
		let $container = this.$board.parent();
		let scale = this.scale_range * Math.min($container.innerWidth(), $container.innerHeight());
		document.documentElement.style.setProperty("--square-size", `${this.square_size * scale}px`);
	}

	setupBoard() {
		let colorIsBlack = true;
		this.$board.empty();
		for (let y = -1; y < this.board_height + 1; y++) {
			let $newRow = $("<div />").addClass(this.class_rank);
			for (let x = -1; x < this.board_width + 1; x++) {
				if (y > -1 && y < this.board_height && x > -1 && x < this.board_width) {
					$("<div />")
						.addClass(colorIsBlack ? this.class_black : this.class_white)
						.addClass(this.class_square)
						.attr("id", "square-x" + x + "-y" + y)
						.attr("data-square", this.square_files.charAt(x) + this.square_ranks.charAt(y))
						.data("x", x)
						.data("y", y)
						.appendTo($newRow);
					colorIsBlack = !colorIsBlack;
				} else if ((y === -1 || y === this.board_height) && x > -1 && x < this.board_width) {
					$("<div />")
						.addClass(this.class_legend)
						.text(this.square_files.charAt(x))
						.appendTo($newRow);
				} else if (y > -1 && y < this.board_height && ( x === -1 || x === this.board_width)) {
					$("<div />")
						.addClass(this.class_legend)
						.html(this.square_ranks.charAt(y))
						.appendTo($newRow);
				} else {
					$("<div />")
						.addClass(this.class_legend)
						.appendTo($newRow);
				}
			}
			$newRow.appendTo(this.$board);
			colorIsBlack = !colorIsBlack;
		}
	}

	updateBoardUI(setupDraggable = true) {
		// Clear previous highlights
		this.$board.find('.highlight-from-white, .highlight-to-white, .highlight-from-black, .highlight-to-black, .highlight-possible-move, .highlight-selected, .highlight-check')
			.removeClass('highlight-from-white highlight-to-white highlight-from-black highlight-to-black highlight-possible-move highlight-selected highlight-check');

		if (this.lastMoveWhite) {
			const { from, to, color } = this.lastMoveWhite;
			this.$board.find(`[data-square=${from}]`).addClass(`highlight-from-${color}`);
			this.$board.find(`[data-square=${to}]`).addClass(`highlight-to-${color}`);
		}

		if (this.lastMoveBlack) {
			const { from, to, color } = this.lastMoveBlack;
			this.$board.find(`[data-square=${from}]`).addClass(`highlight-from-${color}`);
			this.$board.find(`[data-square=${to}]`).addClass(`highlight-to-${color}`);
		}

		this.highlightCheck();

		// Clear all piece spans from the board squares
		this.$board.find(".square span").remove();
		// Redraw pieces based on the current game state
		this.drawBoard();
		// Re-enable dragging for the current player's pieces, unless asked not to
		if (setupDraggable) this.setupDraggable();
	}

	startNewGame() {
		this.state = p4_new_game();
		this.clearMoveHistory();
		this.setGameParameters(); // This sets current_player_types and depth
		this.updateBoardUI();
		if (this.player_type[this.current_player_types[this.state.to_play]] === "Computer") {
			this.timeout_handle = setTimeout(() => this.getComputerMove(), 10);
		}
	}

	setGameParameters() {
		// TODO: get all this from menu
		this.current_player_types = [0, 1]; 
		this.depth = this.$difficultySlider.val();
	}

	drawBoard() {
		for (let y = 9; y > 1; y--) {
			for (let x = 1; x < 9; x++) {
				let i = y * 10 + x;
				let piece = this.getPieceFromP4Index(this.state.board[i]);
				let pieceColor = this.getPieceColorFromP4Index(this.state.board[i]);
				if (piece && pieceColor) {
					let file = this.square_files.charAt(x - 1);
					// Map p4wn engine's 1-9 rank to 0-7 for square_ranks string (87654321)
					// e.g., p4wn y=8 (rank 1) -> square_ranks.charAt(7)
					// p4wn y=2 (rank 7) -> square_ranks.charAt(1)
					let rank = this.square_ranks.charAt(9 - y);
					$(`[data-square='${file}${rank}']`).html(`<span class='${pieceColor}'>${piece}</span>`);
				}
			}
		}
	}

	getPieceFromP4Index(index) {
		if (!index) return null;
		const colorIndex = index & 1; // 0 for white, 1 for black
		const pieceType = index & 14; // P4_PAWN, P4_ROOK, etc. (even numbers)
		const charIndex = this.pieceCharIndexMap[pieceType];
		if (charIndex !== undefined) {
			return this.pieces[colorIndex].charAt(charIndex);
		}
		return null;
	}

	getPieceColorFromP4Index(index) {
		if (!index) return null;
		// Even indices are white (index & 1 === 0), odd are black (index & 1 === 1)
		return (index & 1) === 0 ? this.class_white : this.class_black;
	}

	highlightCheck() {
		p4_maybe_prepare(this.state);
		const inCheck = p4_check_check(this.state, this.state.to_play);
		if (!inCheck) return;

		const kingPiece = this.state.to_play === 0 ? P4_KING : P4_KING | 1;
		let kingPosition = -1;

		// Find the king's position
		for (let i = 0; i < this.state.pieces[this.state.to_play].length; i++) {
			const piece = this.state.pieces[this.state.to_play][i];
			if (piece[0] === kingPiece) {
				kingPosition = piece[1];
				break;
			}
		}

		if (kingPosition !== -1) {
			const kingSquare = p4_stringify_point(kingPosition);
			this.$board.find(`[data-square=${kingSquare}]`).addClass('highlight-check');

			// Find the checking piece
			const opponentColor = 1 - this.state.to_play;
			const board = this.state.board;
			const s = kingPosition;
			const dir = 10 - 20 * this.state.to_play;

			// Pawn attacks
			let attackerPos = s + dir - 1;
			if (board[attackerPos] === (P4_PAWN | opponentColor)) {
				this.$board.find(`[data-square=${p4_stringify_point(attackerPos)}]`).addClass('highlight-check');
				return;
			}
			attackerPos = s + dir + 1;
			if (board[attackerPos] === (P4_PAWN | opponentColor)) {
				this.$board.find(`[data-square=${p4_stringify_point(attackerPos)}]`).addClass('highlight-check');
				return;
			}

			// Knight attacks
			const knight_moves = P4_MOVES[P4_KNIGHT];
			const knight = P4_KNIGHT | opponentColor;
			for (let i = 0; i < 8; i++) {
				attackerPos = s + knight_moves[i];
				if (board[attackerPos] === knight) {
					this.$board.find(`[data-square=${p4_stringify_point(attackerPos)}]`).addClass('highlight-check');
					return;
				}
			}
			
			// King attacks
			const king_moves = P4_MOVES[P4_KING];
			const king = P4_KING | opponentColor;
			for (let i = 0; i < 8; i++) {
				attackerPos = s + king_moves[i];
				if (board[attackerPos] === king) {
					this.$board.find(`[data-square=${p4_stringify_point(attackerPos)}]`).addClass('highlight-check');
					return;
				}
			}

			// Diagonal and grid attacks
			const diagonal_moves = P4_MOVES[P4_BISHOP];
			const grid_moves = P4_MOVES[P4_ROOK];
			const diag_slider = P4_BISHOP | opponentColor;
			const diag_mask = 27;
			const grid_slider = P4_ROOK | opponentColor;
			const grid_mask = 23;

			for (let i = 0; i < 4; i++) {
				let m = diagonal_moves[i];
				let e = s;
				let E;
				do {
					e += m;
					E = board[e];
				} while (!E);
				if ((E & diag_mask) === diag_slider) {
					this.$board.find(`[data-square=${p4_stringify_point(e)}]`).addClass('highlight-check');
					return;
				}

				m = grid_moves[i];
				e = s;
				do {
					e += m;
					E = board[e];
				} while (!E);
				if ((E & grid_mask) === grid_slider) {
					this.$board.find(`[data-square=${p4_stringify_point(e)}]`).addClass('highlight-check');
					return;
				}
			}
		}
	}

	setupDraggable() {
		let draggableSelector = "";
		let humanPlayerType = this.player_type.indexOf("Human");
		if (this.state.to_play === 0 && this.current_player_types[0] === humanPlayerType) {
			draggableSelector = `span.${this.class_white}`;
		} else if (this.state.to_play === 1 && this.current_player_types[1] === humanPlayerType) {
			draggableSelector = `span.${this.class_black}`;
		}
		this.$board.find(`${draggableSelector}`).draggable({
			start: (event, ui) => {
				const el = this.allElementsFromPoint(event.pageX, event.pageY);
				this.dragged_from_square = $(el).filter(".square").not(ui.helper).first().data("square");
				p4_maybe_prepare(this.state);
				const moves = p4_parse(this.state, this.state.to_play, this.state.enpassant, 0);
				const from_square_p4 = p4_destringify_point(this.dragged_from_square);
				for (const move of moves) {
					if (move[1] === from_square_p4) {
						const to_square = p4_stringify_point(move[2]);
						this.$board.find(`[data-square=${to_square}]`).addClass('highlight-possible-move');
					}
				}
			},
			stop: (event, ui) => {
				this.$board.find('.highlight-possible-move').removeClass('highlight-possible-move');
				const el = this.allElementsFromPoint(event.pageX, event.pageY);
				this.dragged_over_square = $(el).filter(".square").not(ui.helper).first().data("square");
				const movedColor = this.state.to_play === 0 ? this.class_white : this.class_black;
				let result = this.state.move(`${this.dragged_from_square}-${this.dragged_over_square}`); // TODO: add optional promotion argument when hitting last row (Qq, Rr, Bb, Nn)
				if (result.ok) {
					const lastMove = {
						from: this.dragged_from_square,
						to: this.dragged_over_square,
						color: movedColor,
						notation: result.string
					};
					if (lastMove.color === this.class_white) {
						this.lastMoveWhite = lastMove;
					} else {
						this.lastMoveBlack = lastMove;
					}
					this.moveHistory.push(lastMove.notation);
					this.updateBoardUI();
					this.updateMoveHistory();
					if (result.flags & P4_MOVE_FLAG_MATE) {
						this.updateBoardUI(false);
						setTimeout(() => {
							const modalBody = document.getElementById('game-over-modal-body');
							modalBody.innerHTML = "Congratulations, You won!";
							const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
							gameOverModal.show();
						}, 10);
					} else if (this.timeout_handle === null) { // TODO: pass this on to next player
						if (this.player_type[this.current_player_types[this.state.to_play]] === "Computer") {
							this.timeout_handle = setTimeout(() => this.getComputerMove(), 10);
						}
					}
				} else {
					this.updateBoardUI();
				}
			}
		});
	}

	allElementsFromPoint(x, y) {
		let element, elements = [];
		let old_visibility = [];
		while (true) {
			element = document.elementFromPoint(x, y);
			if (!element || element === document.documentElement) {
				break;
			}
			elements.push(element);
			old_visibility.push(element.style.visibility);
			element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
		}
		for (let i = 0; i < elements.length; i++) {
			elements[i].style.visibility = old_visibility[i];
		}
		elements.reverse();

		return elements;
	}

	getComputerMove() {
		let startTime = Date.now();
		let localDepth = this.depth;
		let moves = this.state.findmove(localDepth);
		let delta = Date.now() - startTime;
		if (localDepth > 2) {
			let minTime = 25 * localDepth;
			while (delta < minTime) {
				localDepth++;
				moves = this.state.findmove(localDepth);
				delta = Date.now() - startTime;
			}
		}
		if (!moves || (moves[0] === 0 && moves[1] === 0)) {
			this.updateBoardUI(false);
			const modalBody = document.getElementById('game-over-modal-body');
			if (p4_check_check(this.state, this.state.to_play)) {
				modalBody.innerHTML = "Checkmate!";
			} else {
				modalBody.innerHTML = "Stalemate!";
			}
			const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
			gameOverModal.show();
			return;
		}
		const movedColor = this.state.to_play === 0 ? this.class_white : this.class_black;
		let result = this.state.move(moves[0], moves[1]);
		if (result.ok) {
			const lastMove = {
				from: p4_stringify_point(moves[0]),
				to: p4_stringify_point(moves[1]),
				color: movedColor,
				notation: result.string
			};
			if (lastMove.color === this.class_white) {
				this.lastMoveWhite = lastMove;
			} else {
				this.lastMoveBlack = lastMove;
			}
			this.moveHistory.push(lastMove.notation);
			this.updateBoardUI();
			this.updateMoveHistory();
			clearTimeout(this.timeout_handle);
			this.timeout_handle = null;
			if (result.flags & P4_MOVE_FLAG_MATE) {
				this.updateBoardUI(false);
				setTimeout(() => {
					const modalBody = document.getElementById('game-over-modal-body');
					modalBody.innerHTML = "Checkmate!";
					const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
					gameOverModal.show();
				}, 10);
			} else {
				if (this.player_type[this.current_player_types[this.state.to_play]] === "Computer") {
					this.timeout_handle = setTimeout(() => this.getComputerMove(), 10);
				}
			}
		}
		return result;
	}

	handleSquareClick(clickedSquare) {
		const humanPlayerType = this.player_type.indexOf("Human");
		if (this.current_player_types[this.state.to_play] !== humanPlayerType) {
			return; // Not human player's turn
		}

		const clickedSquareData = $(clickedSquare).data("square");

		if (this.selected_square === "") {
			this.selectPiece(clickedSquare, clickedSquareData);
		} else {
			if (this.selected_square === clickedSquareData) {
				this.deselectPiece();
			} else {
				this.movePiece(this.selected_square, clickedSquareData);
			}
		}
	}

	selectPiece(squareElement, squareData) {
		const pieceColor = this.getPieceColorFromP4Index(this.state.board[p4_destringify_point(squareData)]);
		const currentPlayerColor = this.state.to_play === 0 ? this.class_white : this.class_black;

		if (pieceColor === currentPlayerColor) {
			this.selected_square = squareData;
			this.selected_square_node = squareElement;
			$(this.selected_square_node).addClass('highlight-selected');

			p4_maybe_prepare(this.state);
			const moves = p4_parse(this.state, this.state.to_play, this.state.enpassant, 0);
			const from_square_p4 = p4_destringify_point(this.selected_square);

			for (const move of moves) {
				if (move[1] === from_square_p4) {
					const to_square = p4_stringify_point(move[2]);
					this.$board.find(`[data-square=${to_square}]`).addClass('highlight-possible-move');
				}
			}
		}
	}

	deselectPiece() {
		$(this.selected_square_node).removeClass('highlight-selected');
		this.$board.find('.highlight-possible-move').removeClass('highlight-possible-move');
		this.selected_square = "";
		this.selected_square_node = null;
	}

	movePiece(from, to) {
		const movedColor = this.state.to_play === 0 ? this.class_white : this.class_black;
		let result = this.state.move(`${from}-${to}`);
		if (result.ok) {
			const lastMove = {
				from: from,
				to: to,
				color: movedColor,
				notation: result.string
			};
			if (lastMove.color === this.class_white) {
				this.lastMoveWhite = lastMove;
			} else {
				this.lastMoveBlack = lastMove;
			}
			this.moveHistory.push(lastMove.notation);
			this.deselectPiece();
			this.updateBoardUI();
			this.updateMoveHistory();
			if (result.flags & P4_MOVE_FLAG_MATE) {
				this.updateBoardUI(false);
				setTimeout(() => {
					const modalBody = document.getElementById('game-over-modal-body');
					modalBody.innerHTML = "Congratulations, You won!";
					const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
					gameOverModal.show();
				}, 10);
			} else if (this.player_type[this.current_player_types[this.state.to_play]] === "Computer") {
				this.timeout_handle = setTimeout(() => this.getComputerMove(), 10);
			}
		} else {
			this.deselectPiece();
		}
	}

	clearMoveHistory() {
		this.lastMoveWhite = null;
		this.lastMoveBlack = null;
		this.moveHistory = [];
		this.$moveHistoryBody.empty();
	}

	updateMoveHistory() {
		const lastMoveIndex = this.moveHistory.length - 1;
		const lastMove = this.moveHistory[lastMoveIndex];
		if (lastMoveIndex % 2 === 0) { // White's move
			const moveNumber = lastMoveIndex / 2 + 1;
			const row = `<tr><th scope="row">${moveNumber}</th><td>${lastMove}</td><td></td></tr>`;
			this.$moveHistoryBody.append(row);
		} else { // Black's move
			const lastRow = this.$moveHistoryBody.find("tr:last");
			lastRow.find("td:last").text(lastMove);
		}
		const container = this.$moveHistoryContainer;
		if (container[0].scrollHeight > container[0].clientHeight) {
			container.scrollTop(container[0].scrollHeight);
		}
	}

	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
		return instance;
	}

	showToast(message) {
		const toastLiveExample = document.getElementById('liveToast');
		const toastBody = toastLiveExample.querySelector('.toast-body');
		toastBody.textContent = message;
		const toast = new bootstrap.Toast(toastLiveExample);
		toast.show();
	}

	exportGameState() {
		const fen = p4_state2fen(this.state);
		this.$gameStateTextarea.val(fen);
		navigator.clipboard.writeText(fen).then(() => {
			this.showToast("Game state (FEN) copied to clipboard!");
		}).catch(err => {
			console.error("Failed to copy game state: ", err);
			this.showToast("Failed to copy game state to clipboard.");
		});
	}

	importGameState() {
		const fen = this.$gameStateTextarea.val();
		if (fen) {
			try {
				this.state = p4_fen2state(fen);
				this.clearMoveHistory();
				this.updateBoardUI();
				this.$menuContainer.removeClass("open");
				this.showToast("Game state imported successfully!");
			} catch (e) {
				console.error("Failed to import game state: ", e);
				this.showToast("Invalid game state (FEN) provided.");
			}
		} else {
			this.showToast("Please paste a game state (FEN) into the text area.");
		}
	}
}