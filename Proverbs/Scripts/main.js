var Main = function () {
	// Configs
	this.proverbs = [
		'A bird in hand is worth a trip to the pet store.',
		'Absence makes the heat bill smaller.',
		'A chain is only as strong as the strength test show it is.',
		'Actions speak louder while the iron is hot.',
		'A journey of thousand miles begins with a ticket purchase.',
		'An apple a day keeps the farmer happy.',
		'A picture is worth a thousand dollars.',
		'A rolling stone gathers crowds on tour.',
		'A stitch in time keeps the doctor away.',
		'Barking dogs seldom keep a doctor away.',
		'Beauty is in the hand that feeds you.',
		'Beggars can’t be biting the hand that feeds them.',
		'Best things in life are on the other side of the fence.',
		'Better late than never to skin a cat.',
		'Better to be rich and healthy rather than poor and sick.',
		'Cleanliness is next to taking a shower.',
		'Clothes do not make the horse drink.',
		'Curiosity kills one doctor a day.',
		'Don’t bite off more flies with vinegar than with honey.',
		'Don’t bite the hand that skins the cat.',
		'Don’t count your chickens before the fat lady sinks.',
		'Don’t judge a book by its price tag.',
		'Don’t judge a book until the cows come home.',
		'Don’t put all your eggs under a rolling stone.',
		'Don’t put the cart before the sleeping dogs.',
		'Don’t throw the baby if you want to keep the doctor away.',
		'Early cat catches the bird.',
		'Every cloud has some silver sulfide.',
		'Fortune favors those that lead their horse to the water.',
		'Give them an inch and they’ll take your horse to the water.',
		'God helps those who skin the cat themselves.',
		'Good things come to those who take the horse to the water.',
		'Hope for the best, prepare for the cat-skinning.',
		'If it ain’t broke, don’t skin the cat.',
		'If the mountain won’t come to Muhammad, Muhammad must report the mountain to the authorities.',
		'If you can’t beat them, bribe them.',
		'If you play with fire, you must follow safety protocols.',
		'It’s better to be safe than sorry, unless safe is sorry.',
		'One man’s junk is another man’s TV show.',
		'People who live in glass houses should hire good building inspectors.',
		'Slow and steady wins the race without getting arrested.',
		'Strike while the iron is at the optimal temperature according to ISBN.',
		'The grass is always greener when in Rome.',
		'There are more ways than one to pave the road with good intentions.',
		'The road to hell is paved while the cat’s away.',
		'What goes around must come down.',
		'What goes up must come around.',
		'When in Rome, file for refugee status.',
		'Where there’s a will, there’s a cat to skin.',
		'While the cat’s away, the mice can be skinned instead.',
		'You can catch more flies with dead cat than with vinegar.',
		'You can lead a horse to water but you can’t make it skin the cat.',
		'You can’t fit a round peg in a cat without breaking any eggs.',
		'You can’t make an omelet without skinning the cat.',
		'You can’t teach an old dog new ways to skin the cat.',
		'You can’t unscramble a scrambled egg without proper authorization.',
		'Let sleeping dogs lie with the fishes.'
	];

	// Variables

	// Selectors
	this.$container = null;
};

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
		this.setupEventHandlers();
		this.renderProverb();
	},

	setupElementSelectors: function () {
		this.$container = $("div.container");
	},

	setupEventHandlers: function() {
		this.setupContainerClickHandler();
	},

	renderProverb: function () {
		var id = this.getId();
		this.$container.html(
			"<p>As the saying goes, <br /><i>\"" 
			+ this.proverbs[id]
			+ "\"</i></p>");
	},

	getId: function () {
		var urlParams = new URLSearchParams(window.location.search);
		if (urlParams !== null) {
			var id = urlParams.get("id");
			if (id !== null	&& (id >= 0 || id < this.proverbs.length)) {
				return id;
			}
//			var params = urlParams.get("params");
//			if (params !== null) {
//				return this.getIdFromParams(params.split(","););
//			}
		}
		return Math.floor(Math.random() * this.proverbs.length);
	},

	getIdFromParams: function (params) {
		return null; // todo
	},

	setupContainerClickHandler: function() {
		var me = this;
		this.$container.on("click", me.handleContainerClick.bind(me));
	},

	handleContainerClick: function() {
		location.reload();
	}
};

Main.CreateInstance = function (settings) {
	var instance = new Main();
	instance.initialize(settings);
};
