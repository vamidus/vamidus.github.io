/*
 * Attribution:
 * https://stackoverflow.com/a/38362821/13634030
 * https://stackoverflow.com/a/14313213/13634030
 */

/*
 * This program is an implementation of the Huffman-algorithm.
 * Huffman-coding is an algorithm for lossless data compression. It was
 * first published by David A. Huffman in 1952.
 * The algorithm returns a binary code-word for every source symbol. Like
 * most encoding methods, the words for often used symbols are shorter than
 * the ones for not so commonly used symbols. The result is a optimal prefix-
 * free code.
 * For more information see https://en.wikipedia.org/wiki/Huffman_coding.
 */

document.getElementById('startHuff').addEventListener('click', huffman);

/*
 * ================================
 * Data-structures for this program
 * ================================
 */

/**
 * Provides the structure called a node for a binary tree
 */
class Node {
    /**
     * Creates a node
     * @param {number} value Number of occurences
     * @param {char} c The char this node represents
     * @param {Node} left The left child-node
     * @param {Node} right The right child-node
     */
    constructor(value, c, left, right) {
        this.value = value;
        this.c = c;
        this.left = left;
        this.right = right;
    }
}

/**
 * Provides a recursive binary-tree structure
 */
class Tree {
    /**
     * Creates a Tree
     * @param {Node} root The root of the tree
     */
    constructor(root) {
        this.root = root;
    }
}

/*
 * ==================
 * Main-functionality
 * ==================
 */

let input; // The text the user wants to compress
let occurences; // Array that contains the number of occurences of every char
let forest; // Array that contains the nodes for every char
let code; // Array that contains the code-words for every char
let text; // Compressed text
let codeWords; // Array code as user-friendly string
let ascii; // ASCII-text

/**
 * This is the only function that has to be called from outside
 * this script.
 */
function huffman() {
    // get user input
    input = document.getElementById('Input').value;

    // reset variables
    forest = [];
    ascii = '';
    text = '';
    codeWords = '';

    /*
     * Program only creates huffman-tree if
     * user only entered (non-extended) ascii-
     * chars
     */
    if (input != '' && isASCII(input)) {
        // Count occurences of every ascii-char
        count();

        // Create node for every char that occures at least once
        createForest();

        // Apply huffman-algorithm on the created nodes
        createTree();

        /*
         * "translates" the position of the leafs to the codeword
         * of the char represented by the leaf
         *
         *                   #
         *                 0/ \
         *                 /   \
         *                #     #
         *               / \1
         *              /   \
         *                   #
         *                 0/
         *                 /
         *                A
         *
         * The code-word of 'A' would be 010 in this example
         */
        code = new Array(128);
        createCode('', code, forest[0].root);

        // Creating html-table with created code-words
        getCode();

        // Creates string with every char replaced by the code-word
        getText();

        // Creates string with every char replaced by the binary ascii-value
        getAscii();

        // Output
        document.getElementById('Text').value = text;
        document.getElementById('CodeWords').innerHTML = codeWords;
        document.getElementById('numOfCharsText').innerHTML = ' ' + text.length;
        document.getElementById('Ascii').value = ascii;
        document.getElementById('numOfCharsAscii').innerHTML = ' ' + ascii.length;
        document.getElementById('compression').innerHTML = ' ' + text.length +
            ' / ' + ascii.length + ' = ' + (text.length / ascii.length).toFixed(4);
    } else {
        window.alert('Please only enter ASCII-characters.');
    }
}

/**
 * Counts the number of occurences of every ascii-char in input
 */
function count() {
    occurences = new Array(128);

    // Initialize with zero
    for (let i = 0; i < occurences.length; i++) {
        occurences[i] = 0;
    }

    // Count occurences
    for (let i = 0; i < input.length; i++) {
        // charCodeAt(i) returns the ascii-code of the i-th character in the string
        occurences[input.charCodeAt(i)]++;
    }
}

/**
 * Creates the forest with one tree for every char
 */
function createForest() {
    // Create tree (with only one node) for every char the text contains
    for (let i = 0; i < occurences.length; i++) {
        // Only chars that really occur in the text will be taken into account
        if (occurences[i] > 0) {
            // String.fromCharCode(i) returns the char with ascii-code i
            const x = String.fromCharCode(i);
            forest.push(new Tree(new Node(occurences[i], x, null, null)));
        }
    }
}

/**
 * Creates the huffman-tree
 */
function createTree() {
    /*
     * The result of the algorithm is just one tree, so the algorithm has
     * not finished yet, if there are more than one trees.
     */
    while (forest.length > 1) {
        // Find the two trees with the smallest number of occurences
        let minIndex = findMinimum();
        const min1 = forest[minIndex].root;

        /*
         * removes the minIndex-th element; the second parameter tells us that
         * only one element should be removed, starting at index minIndex
         */
        forest.splice(minIndex, 1);

        minIndex = findMinimum();
        const min2 = forest[minIndex].root;
        forest.splice(minIndex, 1);

        // Create new node that has min1 and min2 as child-nodes
        forest.push(new Tree(new Node(min1.value + min2.value, null, min1, min2)));
    }
}

/**
 * Creates the code-words from the created huffman-tree
 * @param {String} str (Part of) the codeword for the current leaf
 * @param {Array} code Array of codewords that has to be filled
 * @param {Node} node Current node
 */
function createCode(str, code, node) {
    if (node == null) {
        return;
    }

    // case the node is a leaf
    if (node.left == null && node.right == null) {
        code[node.c.charCodeAt()] = str;

        // Recursive calls if node is not a leaf
    } else {
        createCode(str + '0', code, node.left);
        createCode(str + '1', code, node.right);
    }
}

/*
 * ================
 * Helper-functions
 * ================
 */

/**
 * Creates a html-table with the codewords
 */
function getCode() {
    codeWords = '<table><tr><th>Character</th><th>' +
        'Occurences</th><th>Huffman-code</th></tr>';
    for (let i = 0; i < code.length; i++) {
        if (occurences[i] > 0) {
            codeWords += '<tr>';
            codeWords += '<td>' + String.fromCharCode(i) + '</td>';
            codeWords += '<td>' + occurences[i] + '</td>';
            codeWords += '<td>' + code[i] + '</td>';
            codeWords += '</tr>';
        }
    }
    codeWords += '</table>';
}

/**
 * Replaces every char with its codeword.
 */
function getText() {
    for (let i = 0; i < input.length; i++) {
        text += code[input.charCodeAt(i)] + ' ';
    }
}

/**
 * Replaces every char with its ASCII-code.
 */
function getAscii() {
    for (let i = 0; i < input.length; i++) {
        ascii += '00'.concat(input.charCodeAt(i).toString(2)).slice(-8) + ' ';
    }
}

/**
 * Finds the minimum.
 * @return {number} index of minimum
 */
function findMinimum() {
    let min = forest[0].root.value;
    let minIndex = 0;
    for (let i = 0; i < forest.length; i++) {
        if (min > forest[i].root.value) {
            minIndex = i;
            min = forest[i].root.value;
        }
    }
    return minIndex;
}

/**
 * Returns true, if str only contains ascii-chars.
 * @param {String} str String the function will be applied on
 * @return {Boolean} test True if str only contains ascii-chars
 */
function isASCII(str) {
    /*
     * returns true if str only contains (non-extended) ascii-chars;
     * see https://www.ascii-code.com/ for reference
     */
    const test = /^[\x00-\x7F]*$/.test(str);
    return test;
}