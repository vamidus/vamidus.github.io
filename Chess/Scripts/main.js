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

		this.dragged_from_square = "";
		this.dragged_over_square = "";

		this.timeout_handle = null;

		// Selectors
		this.$board = null;
	}
	initialize(settings) {
		if (settings) this.applySettings(settings);
		this.setup();
	}
	applySettings(settings) {
		$.extend(this, settings);
	}
	setup() {
		let me = this;
		me.setupElementSelectors();
		me.setupEventListeners();
		me.setCssVariables();
		me.scaleBoard();
		me.setupBoard();
		me.startGame();
		me.drawBoard();
		me.setupDraggable();
	}
	setupElementSelectors() {
		this.$board = $(".board:first");
	}
	setupEventListeners() {
		let me = this;
		$(window).on("resize", me.scaleBoard.bind(me));
	}
	setCssVariables() {
		let me = this;
		document.documentElement.style.setProperty("--square-black", me.square_black);
		document.documentElement.style.setProperty("--square-white", me.square_white);
	}
	scaleBoard() {
		let me = this;
		let $container = me.$board.parent();
		let scale = me.scale_range * Math.min($container.innerWidth(), $container.innerHeight());
		document.documentElement.style.setProperty("--square-size", `${me.square_size * scale}px`);
	}
	setupBoard() {
		let me = this;
		let colorIsBlack = true;
		me.$board.empty();
		for (let y = -1; y < me.board_height + 1; y++) {
			let $newRow = $("<div />").addClass(me.class_rank);
			for (let x = -1; x < me.board_width + 1; x++) {
				if (y > -1 && y < me.board_height && x > -1 && x < me.board_width) {
					$("<div />")
						.addClass(colorIsBlack ? me.class_black : me.class_white)
						.addClass(me.class_square)
						.attr("id", "square-x" + x + "-y" + y)
						.attr("data-square", me.square_files.charAt(x) + me.square_ranks.charAt(y))
						.data("x", x)
						.data("y", y)
						.appendTo($newRow);
					colorIsBlack = !colorIsBlack;
				} else if ((y === -1 || y === me.board_height) && x > -1 && x < me.board_width) {
					$("<div />")
						.addClass(me.class_legend)
						.text(me.square_files.charAt(x))
						.appendTo($newRow);
				} else if (y > -1 && y < me.board_height && ( x === -1 || x === me.board_width)) {
					$("<div />")
						.addClass(me.class_legend)
						.html(me.square_ranks.charAt(y))
						.appendTo($newRow);
				} else {
					$("<div />")
						.addClass(me.class_legend)
						.appendTo($newRow);
				}
			}
			$newRow.appendTo(me.$board);
			colorIsBlack = !colorIsBlack;
		}
	}
	startGame() {
		let me = this;
		me.state = p4_new_game();
	}
	drawBoard() {
		let me = this;
		for (let y = 9; y > 1; y--) {
			for (let x = 1; x < 9; x++) {
				let i = y * 10 + x;
				let piece = me.getPieceFromP4Index(me.state.board[i]);
				if (!!piece) {
					let file = me.square_files.charAt(x - 1);
					let rank = me.square_ranks.charAt(y * -1 + 9);
					$(`[data-square='${file}${rank}']`).html(`<span>${piece}</span>`);
				}
			}
		}
	}
	getPieceFromP4Index(index) {
		let me = this;
		switch (index) {
			case 2:
				return me.pieces[0].charAt(5); // "♙"; // P
			case 3:
				return me.pieces[1].charAt(5); // "♟︎"; // p
			case 4:
				return me.pieces[0].charAt(2); // "♖"; // R
			case 5:
				return me.pieces[1].charAt(2); // "♜"; // r
			case 6:
				return me.pieces[0].charAt(4); // "♘"; // N
			case 7:
				return me.pieces[1].charAt(4); // "♞"; // n
			case 8:
				return me.pieces[0].charAt(3); // "♗"; // B
			case 9:
				return me.pieces[1].charAt(3); // "♝"; // b
			case 10:
				return me.pieces[0].charAt(0); // "♔"; // K
			case 11:
				return me.pieces[1].charAt(0); // "♚"; // k
			case 12:
				return me.pieces[0].charAt(1); // "♕"; // Q
			case 13:
				return me.pieces[1].charAt(1); // "♛"; // q
		}
	}
	setupDraggable() {
		let me = this;
		me.$board.find("span").draggable({
			// revert: true,
			// revertDuration: 1000,
			start: function (event, ui) { // TODO: cleanup signatures
				let el = me.allElementsFromPoint(event.pageX, event.pageY);
				me.dragged_from_square = $(el).filter(".square").not($(this)).first().data("square");
			},
			stop: function (event, ui) { // TODO: cleanup signatures
				let el = me.allElementsFromPoint(event.pageX, event.pageY);
				me.dragged_over_square = $(el).filter(".square").not($(this)).first().data("square");;
				let result = me.state.move(`${me.dragged_from_square}-${me.dragged_over_square}`); // TODO: add optional promotion argument when hitting last row (Qq, Rr, Bb, Nn)
				me.$board.find(".square span").remove();
				me.drawBoard();
				if (result.ok) {
					if (result.flags & P4_MOVE_FLAG_MATE) {
						setTimeout(function() {
							alert("Congratulations, You won! Refresh the page to try again!");
						}, 10);
					} else if (me.timeout_handle === null) {
						me.setupDraggable();
						me.timeout_handle = setTimeout(me.getComputerMove, 10, 5, me);
					}
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
	getComputerMove(depth, me) { // 1 - 5
		let startTime = Date.now();
		let moves = me.state.findmove(depth);
		let delta = Date.now() - startTime;
		if (depth > 2) {
			let minTime = 25 * depth;
			while (delta < minTime) {
				depth++;
				moves = me.state.findmove(depth);
				delta = Date.now() - startTime;
			}
		}
		let result = me.state.move(moves[0], moves[1]);
		if (result.ok) {
			me.$board.find(".square span").remove();
			me.drawBoard();
			if (result.flags & P4_MOVE_FLAG_MATE) {
				setTimeout(function() {
					alert("Checkmate! Refresh the page to try again!");
				}, 10);
			} else {
				me.setupDraggable();
			}
		}
		clearTimeout(me.timeout_handle);
		me.timeout_handle = null;
		return result;
	}
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}