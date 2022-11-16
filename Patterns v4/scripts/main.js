// settings - start

var imgSizeX = 32; // width of tile
var imgSizeY = 32; // hight of tile
var tileClass = "b"; // tile class to use
var tileClassSize = 6; // number of tiles
var orientationClasses = ["rot-090", "rot-180", "rot-270"]; // all orientation classes
var flipClasses = ["flip-x", "flip-y"]; // all flip classes
var pattern = 2; // pattern logic to use

// settings - end

// variables - start

var canvas = []; // holds array of arrays of objects, containing tile types, orientation and flip data
var $container = null; // references the table to add rows/cells to
var maxCols = 0; // holds max cols that fit in body
var maxRows = 0; // holds max rows that fit in body

// variables - end

// hook - start

$(document).ready( function () {
	setup(); // get variables filled in
	createCanvas(); // populate canvas with whatever pattern chosen
	adjustContainer(); // set table width to static; it messes with spacing
	drawCanvas(); // dump canvas on table
});

// hook - end

// methods - start

function setup () {
	$container = $("#container");
	maxCols = Math.floor($(window).innerWidth() / imgSizeX);
	maxRows = Math.floor($(window).innerHeight() / imgSizeY);
}

function adjustContainer () {
//	var r = Math.floor(Math.random() * 256);
//	var g = Math.floor(Math.random() * 256);
//	var b = Math.floor(Math.random() * 256);
	$container.css({
		"height": (canvas.length * imgSizeY) + "px",
		"width": (canvas[0].length * imgSizeX) + "px"//,
		//"background-color": "rgb(" + r + "," + g + "," + b + ")"
	});
}

function createCanvas () {
	switch (pattern) {
		case 0:
			pattern0();
			break;
		case 1:
			pattern1();
			break;
		case 2:
			pattern2();
			break;
		default:
			pattern0();
	}
}

// methods - end

// patterns - start

function pattern0 () {
	for (var y = 0; y < maxRows; y ++) {
		var cells = [];
		for (var x = 0; x < maxCols; x ++) {
			cells.push({
				baseTile: randomBaseTile(),
				orientation: randomOrientation(),
				flip: randomFlip()
			});
		}
		canvas.push(cells);
	}
}

function pattern1 () {
	var halfMaxCols = Math.ceil(maxCols / 2);
	var halfMaxRows = Math.ceil(maxRows / 2);
	var xStart = (halfMaxCols == maxCols / 2) ? 1 : 2;
	var yStart = (halfMaxRows == maxRows / 2) ? 1 : 2;
	for (var y = 0; y < halfMaxRows; y ++) {
		var cells = [];
		for (var x = 0; x < halfMaxCols; x ++) {
			cells.push({
				baseTile: randomBaseTile(),
				orientation: randomOrientation(),
				flip: randomFlip()
			});
		}
		for (var x = cells.length - xStart; x >= 0; x --) {
			cells.push({
				baseTile: cells[x].baseTile,
				orientation: cells[x].orientation,
				flip: flipX(cells[x].flip)
			});
		}
		canvas.push(cells);
	}
	for (var y = canvas.length - yStart; y >= 0; y --) {
		var cells = [];
		for (var x = canvas[y].length - 1; x >= 0; x --) {
			cells.push({
				baseTile: canvas[y][x].baseTile,
				orientation: canvas[y][x].orientation,
				flip: flipX(flipY(canvas[y][x].flip))
			});
		}
		canvas.push(cells);
	}
}

function pattern2 () {
	var dict = "ABbCcOoDEePpFf";
	var encTileObjects = [
		[ // A
			{ baseTile: 1, orientation: 0, flip: 0 },
			{ baseTile: 1, orientation: 1, flip: 0 },
			{ baseTile: 1, orientation: 2, flip: 0 },
			{ baseTile: 1, orientation: 3, flip: 0 }
		],
		[ // B
			{ baseTile: 2, orientation: 0, flip: 0 },
			{ baseTile: 2, orientation: 2, flip: 0 }
		],
		[ // b
			{ baseTile: 2, orientation: 1, flip: 0 },
			{ baseTile: 2, orientation: 3, flip: 0 }
		],
		[ // C
			{ baseTile: 3, orientation: 0, flip: 0 }
		],
		[ // c
			{ baseTile: 3, orientation: 1, flip: 0 }
		],
		[ // O
			{ baseTile: 3, orientation: 2, flip: 0 }
		],
		[ // o
			{ baseTile: 3, orientation: 3, flip: 0 }
		],
		[ // D
			{ baseTile: 4, orientation: 0, flip: 0 },
			{ baseTile: 4, orientation: 1, flip: 0 },
			{ baseTile: 4, orientation: 2, flip: 0 },
			{ baseTile: 4, orientation: 3, flip: 0 }
		],
		[ // E
			{ baseTile: 5, orientation: 0, flip: 0 }
		],
		[ // e
			{ baseTile: 5, orientation: 1, flip: 0 }
		],
		[ // P
			{ baseTile: 5, orientation: 2, flip: 0 }
		],
		[ // p
			{ baseTile: 5, orientation: 3, flip: 0 }
		],
		[ // F
			{ baseTile: 6, orientation: 0, flip: 0 },
			{ baseTile: 6, orientation: 2, flip: 0 }
		],
		[ // f
			{ baseTile: 6, orientation: 1, flip: 0 },
			{ baseTile: 6, orientation: 3, flip: 0 }
		]
	];
	var plainText = prompt("Enter text:", "Vadym rocks!");
	if (plainText != null) {
		var i = 0;
		var encText = getEncText(plainText, dict);
		for (var row = 0; row < maxRows; row ++) {
			var cols = [];
			for (var col = 0; col < maxCols; col ++) {
				cols.push(getTileObjectFromWord(dict, encText.charAt(i), encTileObjects));
				if (i + 1 == encText.length) {
					canvas.push(cols);
					return;
				}
				else {
					i ++;
				}
			}
			canvas.push(cols);
		}
	}
}
// patterns - end

// start - utils

function drawCanvas () {
	var html = "";
	for (var row = 0; row < canvas.length; row ++) {
		html += "<tr id='row" + row + "'>";
		for (var col = 0; col < canvas[row].length; col ++) {
			html += "<td id='row" + row + "-col" + col + "' class='" + getClassString(canvas[row][col].baseTile, canvas[row][col].orientation, canvas[row][col].flip) + "'></td>";
		}
		html += "</tr>";
	}
	$container.append(html);
}

function getClassString (baseTile, orientation, flip) {
	var result = [];
	result.push(getBaseTileClass(baseTile));
	result.push(getOrientationClass(orientation));
	result.push(getFlipClass(flip));
	return $.grep(result, Boolean).join(" ");
}

function randomBaseTile () {
	return Math.floor(Math.random() * tileClassSize + 1); // 1 - 6
}

function getBaseTileClass (i) {
	return tileClass + i; // a1 - ax, b1 - bx, etc
}

function randomOrientation () {
	// there are only 4 ways we can face; 0 = original; 1 = 90 deg; 2 = 180 deg; 3 = 270 deg
	return Math.floor(Math.random() * 4); // 0 - 3
}

function getOrientationClass (i) {
	if (i == 0) {
		return ""; // 0 deg
	}
	else {
		return orientationClasses[i - 1]; // 90, 180 and 270 deg
	}
}

function randomFlip () {
	// we can flip Y, X, both or none; 0 = none, 1 = X, 2 = Y, 3 = X and Y
	return Math.floor(Math.random() * 4); // 0 - 3
}

function getFlipClass (i) {
	var result = [];
	switch (i) {
		case 1: // X
			result.push(flipClasses[0]);
			break;
		case 2: // Y
			result.push(flipClasses[1]);
			break;
		case 3: // X and Y
			result.push(flipClasses[0]);
			result.push(flipClasses[1]);
			break;
		default: // 0 is a "no-flip"
			break;
	}
	return $.grep(result, Boolean).join(" ");
}

function flipX (i) {
	switch (i) {
		case 0: // no flip
		case 2: // flip Y
			return i + 1; // add X-flip
			break;
		case 1: // flip X
		case 3: // flilp XY
			return i - 1; // remove X-filp
			break;
	}
}

function flipY (i) {
	switch (i) {
		case 0: // no flip
		case 1: // flip X
			return i + 2; // add Y-flip
			break;
		case 2: // flip Y
		case 3: // flilp XY
			return i - 2; // remove Y-flip
			break;
	}
}

function getEncText (plainText, dict) {
	var result = "";
	for (var i = 0; i < plainText.length; i ++) {
		result += myEncode(plainText.charCodeAt(i), dict);
	}
	return result;
}

function myEncode(myInt, dict) {
	var v = myInt, rema, t = "";
	do {
		rema = v % dict.length;
		v = Math.floor(v / dict.length);
		t = dict.charAt(rema) + t;
	} while (v >= dict.length);
	return dict.charAt(v) + t;
}

function getTileObjectFromWord (dict, word, encTileObjects) {
	var index = dict.indexOf(word);
	return encTileObjects[index][Math.floor(Math.random() * encTileObjects[index].length)];
}

// end - utils
