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
		
		        this.timeout_handle = null;
		this.lastMoveWhite = null;
		this.lastMoveBlack = null;
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
		const preferredScheme = this.getPreferredColorScheme();
		this.setColorScheme(preferredScheme);
		$(`#${preferredScheme}-scheme`).prop('checked', true);
		const difficulty = this.getDifficulty();
		this.$difficultySlider.val(difficulty);
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
		// this.$cancelButton = $("#cancel-button");
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
		// this.$cancelButton = $("click", () => {
		// 	this.$menuContainer.removeClass("open");
		// });

		$('input[name="color-scheme"]').on('change', (e) => {
			this.setColorScheme(e.target.id.split('-')[0]);
		});
		this.$difficultySlider.on('input', (e) => {
			this.depth = e.target.value;
			localStorage.setItem('difficulty', this.depth);
			// console.log("Difficulty:", this.depth); // TODO: remove when done
		});
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
		this.$board.find('.highlight-from-white, .highlight-to-white, .highlight-from-black, .highlight-to-black, .highlight-possible-move').removeClass('highlight-from-white highlight-to-white highlight-from-black highlight-to-black highlight-possible-move');

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

		// Clear all piece spans from the board squares
		this.$board.find(".square span").remove();
		// Redraw pieces based on the current game state
		this.drawBoard();
		// Re-enable dragging for the current player's pieces, unless asked not to
		if (setupDraggable) this.setupDraggable();
	}
	startNewGame() {
		this.lastMoveWhite = null;
		this.lastMoveBlack = null;
		this.state = p4_new_game();
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
				if (piece && pieceColor) { // Removed redundant '!!'
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
				let result = this.state.move(`${this.dragged_from_square}-${this.dragged_over_square}`); // TODO: add optional promotion argument when hitting last row (Qq, Rr, Bb, Nn)
				// console.log("Human move:", result); // todo: disable debug when done
				if (result.ok) {
					const lastMove = {
						from: this.dragged_from_square,
						to: this.dragged_over_square,
						color: this.state.to_play === 0 ? this.class_white : this.class_black
					};
					if (lastMove.color === this.class_white) {
						this.lastMoveWhite = lastMove;
					} else {
						this.lastMoveBlack = lastMove;
					}
					this.updateBoardUI();
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
		let result = this.state.move(moves[0], moves[1]);
		// console.log("Moves:", moves);
		// console.log("Computer move:", result); // todo: disable debug when done
		// console.log("State:", this.state);
		if (result.ok) {
			const lastMove = {
				from: p4_stringify_point(moves[0]),
				to: p4_stringify_point(moves[1]),
				color: this.state.to_play === 0 ? this.class_white : this.class_black
			};
			if (lastMove.color === this.class_white) {
				this.lastMoveWhite = lastMove;
			} else {
				this.lastMoveBlack = lastMove;
			}
			this.updateBoardUI();
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
	
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
		return instance;
	}
}