class Main {
	constructor() {
		// Configs
		this.xxx = 0;

		// Variables
		this.board_height = 8;
		this.board_width = 8; // TODO: set all CSS vars here

		this.class_black = "black";
		this.class_white = "white";
		this.class_square = "square";
		this.class_rank = "rank";

		this.square_files = "abcdefgh";
		this.square_ranks = "87654321";

		// Selectors
		this.$board = null;
	}
	initialize(settings) {
		if (settings)
			this.applySettings(settings);
		this.setup();
	}
	applySettings(settings) {
		$.extend(this, settings);
	}
	setup() {
		this.setupElementSelectors();
		this.setupBoard();
	}
	setupElementSelectors() {
		this.$board = $(".board:first");
	}
	setupBoard() {
		let me = this;
		let color_index = 0;
		me.$board.empty();
		for (let y = 0; y < me.board_height; y++) {
			let $newRow = $("<div />")
				.addClass(me.class_rank);
			for (let x = 0; x < me.board_width; x++) {
				$("<div />")
					.addClass(me.isEven(color_index) ? me.class_white : me.class_black)
					.addClass(me.class_square)
					.attr("id", "cell-x" + x + "-y" + y)
					.data("x", x)
					.data("y", y)
					.appendTo($newRow);
				color_index++;
			}
			$newRow.appendTo(me.$board);
			color_index--;
		}
	}
	isEven(number) {
		return number % 2 === 0
	}
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}