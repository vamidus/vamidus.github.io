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
		me.setupPieces();
	}
	setupElementSelectors() {
		this.$board = $(".board:first");
	}
	setupEventListeners() {
		let me = this;
		$(window).on("resize", me.scaleBoard.bind(me));
	}
	scaleBoard() {
		let me = this;
		let $container = me.$board.parent();
		let scale = me.scale_range * Math.min($container.innerWidth(), $container.innerHeight());
		document.documentElement.style.setProperty("--square-size", `${me.square_size * scale}px`);
	}
	setCssVariables() {
		let me = this;
		document.documentElement.style.setProperty("--square-black", me.square_black);
		document.documentElement.style.setProperty("--square-white", me.square_white);
	}
	setupBoard() {
		let me = this;
		let colorIsBlack = true;
		me.$board.empty();
		for (let y = -1; y < me.board_height + 1; y++) {
			let $newRow = $("<div />")
				.addClass(me.class_rank);
			for (let x = -1; x < me.board_width + 1; x++) {
				if (y > -1 && y < me.board_height && x > -1 && x < me.board_width) {
					$("<div />")
						.addClass(colorIsBlack ? me.class_black : me.class_white)
						.addClass(me.class_square)
						.attr("id", "square-x" + x + "-y" + y)
						.attr("data-square", me.square_files.charAt(x) + me.square_ranks.charAt(y))
						//.prop("title", me.square_files.charAt(x) + me.square_ranks.charAt(y))
						//.text(me.square_files.charAt(x) + me.square_ranks.charAt(y))
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
	setupPieces() {
		let me = this;
		me.setupBottomPieces();
		me.setupTopPieces();
		me.$board.find("span").draggable({ 
			containment: me.$board,
			refreshPositions: true,
			//opacity: .75, 
			revert: function () {
				return false; // todo: validate the move here
			},
			//snap: true,
			//grid: [64, 64], 

			start: function (event) {
				//debugger;
			},

			stop: function (event) {
				//debugger;
			},

			// drag: function (event, ui) {
			// 	var zoom = document.documentElement.style.getPropertyValue("--board-scale");
			// 	var original = ui.originalPosition;

			// 	// jQuery will simply use the same object we alter here
			// 	ui.position = {
			// 		left: (event.clientX - me.click.x + original.left - me.$board.position().left) / zoom,
			// 		top:  (event.clientY - me.click.y + original.top  - me.$board.position().top ) / zoom
			// 	};			
			// }
		});
	}
	setupBottomPieces() {
		let me = this;
		let thisColor = me.aiIsBlack ? "white" : "black";
		me.setPiece(thisColor, "Ra1");
		me.setPiece(thisColor, "Nb1");
		me.setPiece(thisColor, "Bc1");
		me.setPiece(thisColor, "Qd1");
		me.setPiece(thisColor, "Ke1");
		me.setPiece(thisColor, "Bf1");
		me.setPiece(thisColor, "Ng1");
		me.setPiece(thisColor, "Rh1");
		for (let i = 0; i < me.square_files.length; i++) {
			me.setPiece(thisColor, `${me.square_files.charAt(i)}2`);
		}
	}
	setupTopPieces() {
		let me = this;
		let thisColor = me.aiIsBlack ? "black" : "white";
		me.setPiece(thisColor, "Ra8");
		me.setPiece(thisColor, "Nb8");
		me.setPiece(thisColor, "Bc8");
		me.setPiece(thisColor, "Qd8");
		me.setPiece(thisColor, "Ke8");
		me.setPiece(thisColor, "Bf8");
		me.setPiece(thisColor, "Ng8");
		me.setPiece(thisColor, "Rh8");
		for (let i = 0; i < me.square_files.length; i++) {
			me.setPiece(thisColor, `${me.square_files.charAt(i)}7`);
		}
	}
	setPiece(color, move) {
		let me = this;
		let i = (color === "white") ? 0 : 1;
		let piece = "P";
		let rank = null;
		let file = null;
		if ("KQRBNP".indexOf(move.charAt(0)) > -1) { // indexOf is case-sensitive, so there's no collision between B and b; This may be a problem - to be solved later
			piece = move.charAt(0);
			rank = move.charAt(1);
			file = move.charAt(2);
		} else {
			rank = move.charAt(0);
			file = move.charAt(1);
		}
		let p = null;
		switch (piece.toUpperCase()) {
			case "K": // ♔/♚
				p = 0;
				break;
			case "Q": // ♕/♛
				p = 1;
				break;
			case "R": // ♖/♜
				p = 2;
				break;
			case "B": // ♗/♝
				p = 3;
				break;
			case "N": // ♘/♞
				p = 4;
				break;
			case "P": // ♙/♟︎
			default:  // ♙/♟︎
				p = 5;
				break;
		}
		if (!rank || !file || p === null) return;
		$(`[data-square='${rank}${file}']`).html(`<span>${me.pieces[i].charAt(p)}</span>`);
	}
	// isEven(number) {
	// 	return number % 2 === 0
	// }
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}