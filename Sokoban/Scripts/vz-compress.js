/*
	VZ-COMPRESS v1.0

	This will compress text by turning leters that repeat more than 2 times into 
	that letter followed by the number of repetitions. Example:
	compress("AaABbCccC") returns "A3BBC4" *

	This can be reversed by turning numbers that follow a letter into a sequence
	of that letter. Example:
	decompress("A3BBC4") returns "AAABBCCCC" *

	Restriction: numbers are not supported!

	* - This process also upper-cases the text!

	Hastily threwn together by Vadym Zakrevskyy one Friday night, 2/24/2023

	LEGAL/LICENSING: Do whatever you want with VZ-COMPRESS, but I can't be held responsible for what this thing does! Use at your own risk!!! Example:
    If this thing compresses your dog, I am not to blame: you should have used a better algorithm to drive your pet gizmo!
*/

let characterRepeatThreshold = 2; // 1 and 2 compresses to the same rate, but 1 costs extra CPU to process... although it looks cooler.

function compress(input) {
	let result = "";
	input = input.toUpperCase();
	for (let index = 0; index < input.length; index++) {
		let word = getWord(index, input);
		if (word.characterCount > characterRepeatThreshold) {
			result += input.charAt(index) + word.characterCount;
		} else {
			result += input.charAt(index).repeat(word.characterCount);
		}
		index += word.characterCount - 1;
	}
	return result;
}

function decompress(input) {
	let result = "";
	input = input.toUpperCase();
	for (let characterIndex = 0; characterIndex < input.length; characterIndex++) {
		let currentChar = input.charAt(characterIndex);
		if (characterIndex + 1 >= input.length
			|| !isNumeric(input.charAt(characterIndex + 1))) {
			result += currentChar;
		} else {
			let count = "";
			let countIndex = 1
			do {
				count += input.charAt(characterIndex + countIndex);
				countIndex++;
			} while (characterIndex + countIndex < input.length 
				&& isNumeric(input.charAt(characterIndex + countIndex)));
			result += currentChar.repeat(count);
			characterIndex += countIndex - 1;
		}
	}
	return result;
}

function getWord(index, input) {
	let cStart = input.charAt(index);
	let count = 0;
	do {
		count++;
	} while (input.charAt(index + count) === cStart);
	return {
		"character": cStart,
		"characterCount": count
	};
}

function isNumeric(value) {
    return !isNaN(value - parseFloat(value));
}