var Main = function () {
	// Configs
	this.fieldWidth = 0;
	this.fieldHeight = 0;
	this.numberOfPlayers = 0;

	// Variables
	this.anotherGo = false;
	this.currentPlayer = 0;
	this.field = [];

	// Selectors
	this.$container = null;
	this.$field = null;
}

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
		this.setupField();
		this.setupFieldClickHandler();
	},

	setupElementSelectors: function () {
		this.$container = $("#container");
	},

	setupField: function () {
		this.$field = $("<table />");
		this.field = [];
		for (var y = 0; y < this.fieldHeight; y++) {
			var $fieldRow = $("<tr />");
			var fieldRow = [];
			for (var x = 0; x < this.fieldWidth; x++) {
				$("<td />")
					.attr("x", x)
					.attr("y", y)
					.appendTo($fieldRow);
				fieldRow.push({ 
					dot_of_player: null,
					property_of_player: null,
					looked_by_player: null
				});
			}
			$fieldRow.appendTo(this.$field);
			this.field.push(fieldRow);
		}
		this.$field.appendTo(this.$container);
	},

	setupFieldClickHandler: function () {
		var me = this;
		this.$field
			.find("td")
			.click(me.fieldClickHandler.bind(me));
	},

	fieldClickHandler: function (event) {
		var x = $(event.target).attr("x") - 0;
		var y = $(event.target).attr("y") - 0;
		if (!this.isOccupied(x, y)) {
			this.field[y][x].dot_of_player = this.currentPlayer;
			if (this.countMyNeighbours(x, y, this.currentPlayer) > 1) {
				this.captureProperty(x, y, this.currentPlayer);
			}
			this.updateField();
			if (!this.anotherGo) {
				this.nextPlayer();
			}
			else {
				this.anotherGo = false;
			}
		}
	},

	isOccupied: function (x, y) {
		return (this.field[y][x].dot_of_player !== null 
			|| this.field[y][x].property_of_player !== null);
	},

	countMyNeighbours: function (x, y, player) {
		var result = 0;
		if (y > 0 && this.field[y - 1][x].dot_of_player === player) {
			result++; // N
		}
		if (y < this.fieldHeight - 1 && this.field[y + 1][x].dot_of_player === player) {
			result++; // S
		}
		if (x > 0 && this.field[y][x - 1].dot_of_player === player) {
			result++; // W
		}
		if (x < this.fieldWidth - 1 && this.field[y][x + 1].dot_of_player === player) {
			result++; // E
		}
		if (y > 0 && x > 0 && this.field[y - 1][x - 1].dot_of_player === player && this.field[y - 1][x - 1].property_of_player === null) {
			result++; // NW
		}
		if (y < this.fieldHeight - 1 && x > 0 && this.field[y + 1][x - 1].dot_of_player === player && this.field[y + 1][x - 1].property_of_player === null) {
			result++; // SW
		}
		if (y > 0 && x < this.fieldWidth - 1 && this.field[y - 1][x + 1].dot_of_player === player && this.field[y - 1][x + 1].property_of_player === null) {
			result++; // NE
		}
		if (y < this.fieldHeight - 1 && x < this.fieldWidth - 1 && this.field[y + 1][x + 1].dot_of_player === player && this.field[y + 1][x + 1].property_of_player === null) {
			result++; // SE
		}
		return result;
	},

	captureProperty: function (x, y, player) {
		var result = false;
		if (y > 0 && this.field[y - 1][x].dot_of_player !== player) {
			if (this.canReachEdge(x, y - 1, player)) {
				this.clearLookedByPlayer();
			}
			else {
				this.anotherGo = false;
				this.updateField();
				result = true;
			}
		}
		if (y < this.fieldHeight - 1 && this.field[y + 1][x].dot_of_player !== player) {
			if (this.canReachEdge(x, y + 1, player)) {
				this.clearLookedByPlayer();
			}
			else {
				this.anotherGo = false;
				this.updateField();
				result = true;
			}
		}
		if (x > 0 && this.field[y][x - 1].dot_of_player !== player) {
			if (this.canReachEdge(x - 1, y, player)) {
				this.clearLookedByPlayer();
			}
			else {
				this.anotherGo = false;
				this.updateField();
				result = true;
			}
		}
		if (x < this.fieldWidth - 1 && this.field[y][x + 1].dot_of_player !== player) {
			if (this.canReachEdge(x + 1, y, player)) {
				this.clearLookedByPlayer();
			}
			else {
				this.anotherGo = false;
				this.updateField();
				result = true;
			}
		}
		return result;
	},

	canReachEdge: function (x, y, player) {
		if (this.field[y][x].looked_by_player === player) {
			return false;
		}
		if (this.field[y][x].dot_of_player === player && (this.field[y][x].property_of_player === null || this.field[y][x].property_of_player === player)) {
			return false;
		}
		if (this.field[y][x].dot_of_player !== player && (this.field[y][x].property_of_player === null || this.field[y][x].property_of_player !== player)) {
			this.anotherGo = true;
		}
		if (y === 0 || y === this.fieldHeight - 1 || x === 0 || x === this.fieldWidth - 1) {
			return true;
		}
		this.field[y][x].looked_by_player = player;
		return (this.canReachEdge(x, y - 1, player) || this.canReachEdge(x, y + 1, player) || this.canReachEdge(x - 1, y, player) || this.canReachEdge(x + 1, y, player));
	},

	updateField: function () {
		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				if (this.field[y][x].looked_by_player !== null) {
					this.field[y][x].property_of_player = this.field[y][x].looked_by_player;
					this.field[y][x].looked_by_player = null;
				}
				var newClasses = [];
				if (this.field[y][x].dot_of_player !== null) {
					newClasses.push("dot-of-player-" + this.field[y][x].dot_of_player);
				}
				if (this.field[y][x].property_of_player !== null) {
					newClasses.push("property-of-player-" + this.field[y][x].property_of_player);
				}
				this.$field
					.find("td[x=" + x + "][y=" + y + "]")
					.attr("class", newClasses.join(" "));
			}
		}
	},

	clearLookedByPlayer: function () {
		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				if (this.field[y][x].looked_by_player !== null) {
					this.field[y][x].looked_by_player = null;
				}
			}
		}
	},

	nextPlayer: function () {
		this.currentPlayer = (this.currentPlayer + 1 === this.numberOfPlayers) ? 0 : this.currentPlayer + 1;
		console.log("current player: " + this.currentPlayer + " " + (this.currentPlayer == 0 ? "(red)" : "(blue)"));
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
