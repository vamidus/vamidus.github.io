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
	this.$stats = null;
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
		this.nextPlayer();
	},

	setupElementSelectors: function () {
		this.$container = $("#container");
		this.$stats = $("#stats");
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
					property_matrix: null,
					looked_by_player: null,
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
				this.anotherGo = true;
				this.updateField();
				result = true;
			}
		}
		if (y < this.fieldHeight - 1 && this.field[y + 1][x].dot_of_player !== player) {
			if (this.canReachEdge(x, y + 1, player)) {
				this.clearLookedByPlayer();
			}
			else {
				this.anotherGo = true;
				this.updateField();
				result = true;
			}
		}
		if (x > 0 && this.field[y][x - 1].dot_of_player !== player) {
			if (this.canReachEdge(x - 1, y, player)) {
				this.clearLookedByPlayer();
			}
			else {
				this.anotherGo = true;
				this.updateField();
				result = true;
			}
		}
		if (x < this.fieldWidth - 1 && this.field[y][x + 1].dot_of_player !== player) {
			if (this.canReachEdge(x + 1, y, player)) {
				this.clearLookedByPlayer();
			}
			else {
				this.anotherGo = true;
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
			}
		}
		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				if (this.field[y][x].property_of_player === null) {
					if (this.field[y][x].dot_of_player !== null) {
						this.field[y][x].property_matrix = this.getPropertyMatrix(x, y, this.field[y][x].dot_of_player);
					}
				}
			}
		}
		for (var y = 0; y < this.fieldHeight; y++) {
			for (var x = 0; x < this.fieldWidth; x++) {
				var newClasses = [];
				if (this.field[y][x].dot_of_player !== null) {
					newClasses.push("dot-of-player-" + this.field[y][x].dot_of_player);
					if (this.field[y][x].property_matrix !== null) {
						var matrix = this.getPropertMatrixSuffix(this.field[y][x].property_matrix);
						if (matrix == "[full]") {
							newClasses.push("property-of-player-" + this.field[y][x].dot_of_player);
						} else {
							newClasses.push("property-of-player-" + this.field[y][x].dot_of_player + "-" + this.getPropertMatrixSuffix(this.field[y][x].property_matrix));
						}
					}
				}
				if (this.field[y][x].property_of_player !== null) {
					newClasses.push("property-of-player-" + this.field[y][x].property_of_player);
				}
				this.$field
					.find("td[x=" + x + "][y=" + y + "]")
					//.attr("title", JSON.stringify(this.field[y][x])) // TODO: remove debug
					.attr("class", newClasses.join(" "));
			}
		}
	},

	getPropertyMatrix: function (x, y, player) {
		var matrix = "";  // IMPORTANT: do NOT change the order!
		if (y > 0 && x > 0 && this.field[y-1][x-1].property_of_player == player) {
			matrix += "7"; // NW
		}
		if (y > 0 && this.field[y-1][x].property_of_player == player) {
			matrix += "0" // N
		}
		if (y > 0 && x < this.fieldWidth && this.field[y-1][x+1].property_of_player == player) {
			matrix += "1" // NE
		}
		if (x > 0 && this.field[y][x-1].property_of_player == player) {
			matrix += "6"; // W
		}
		if (x < this.fieldWidth && this.field[y][x+1].property_of_player == player) {
			matrix += "2"; // E
		}
		if (y < this.fieldHeight && x > 0 && this.field[y+1][x-1].property_of_player == player) {
			matrix += "5"; // SW
		}
		if (y < this.fieldHeight && this.field[y+1][x].property_of_player == player) {
			matrix += "4"; // S
		}
		if (y < this.fieldHeight && x < this.fieldWidth && this.field[y+1][x+1].property_of_player == player) {
			matrix += "3"; // SE
		}
		return matrix === "" ? null : matrix;
	},

	getPropertMatrixSuffix: function (matrix) {
		switch(matrix) {
			case "0":
				return "up1";
			case "2":
				return "right1";
			case "4":
				return "down1";
			case "6":
				return "left1";
			case "01":
				return "outnne2";
			case "12":
				return "outne2";
			case "23":
				return "outse2";
			case "43":
				return "outsse2";
			case "54":
				return "outssw2";
			case "65":
				return "outsw2";
			case "76":
				return "outnw2";
			case "70":
				return "outnnw2";
			case "643":
			case "6543":
				return "inssw3";
			case "764":
			case "7654":
				return "insw3";
			case "065":
			case "7065":
				return "innw3";
			case "016":
			case "7016":
				return "innnw3";
			case "702":
			case "7012":
				return "innne3";
			case "023":
			case "0123":
				return "inne3";
			case "124":
			case "1243":
				return "inse3";
			case "254":
			case "2543":
				return "insse3";
			case "701":
				return "up2";
			case "123":
				return "right2";
			case "543":
				return "down2";
			case "765":
				return "left2";
			case "24":
			case "243":
				return "se2";
			case "64":
			case "654":
				return "sw2";
			case "06":
			case "706":
				return "nw2";
			case "02":
			case "012":
				return "ne2";
			case "024":
			case "0124":
			case "0243":
			case "0143":
			case "01243":
				return "right3";
			case "624":
			case "6243":
			case "6254":
			case "6253":
			case "62543":
				return "down3";
			case "064":
			case "7064":
			case "0654":
			case "7054":
			case "70654":
				return "left3";
			case "062":
			case "7062":
			case "0162":
			case "7162":
			case "70162":
				return "up3";
			case "0165":
			case "70165":
				return "nw4";
			case "7023":
			case "70123":
				return "ne4";
			case "1254":
			case "12543":
				return "se4";
			case "7643":
			case "76543":
				return "sw4";
			case "0624":
			case "01624":
			case "01625":
			case "01654":
			case "06243":
			case "06253":
			case "062543":
			case "70143":
			case "701543":
			case "70243":
			case "70254":
			case "70624":
			case "71624":
			case "76243":
				return "[full]";
			case "":
			case null:
				return null;
			default:
				return matrix;
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
		this.$field
			.removeClass()
			.addClass("turn-of-player-" + this.currentPlayer);
		this.updateStats();
	},

	updateStats: function () {
		//this.$stats.text("current player: " + this.currentPlayer + " " + (this.currentPlayer == 0 ? "(red)" : "(blue)"));
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
