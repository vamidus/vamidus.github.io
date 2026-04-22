class Main {
	constructor() {
		// Configs
		this.tileSize = 100;
		this.tilePadding = 5;

		// Variables
		this.tileDiagonal = Math.sqrt(2) * this.tileSize; // Diagonal of the square tile
        
		// Selectors
		this.$patternContainer = null;
	}

	initialize(settings) {
		if (settings) this.applySettings(settings);
		this.setup();
	}

	applySettings(settings) {
		$.extend(this, settings);
	}

	setup() {
		this.setupElementSelectors();
		this.setupEventListeners();
		this.createPattern();
	}

	setupElementSelectors() {
		this.$patternContainer = $("#patternContainer");
	}

	setupEventListeners() {
		$(window).on("resize", this.createPattern.bind(this));
	}

	createPattern() {
		this.$patternContainer.empty();
		const viewportHeight = Math.ceil(window.innerHeight * 1.5);
		const viewportWidth = Math.ceil(window.innerWidth * 1.5);
		const cols = Math.ceil(viewportWidth / this.tileDiagonal) + 1;
        const rows = Math.ceil(viewportHeight / this.tileDiagonal) + 1;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                
                const ellipse1 = document.createElement('div');
                ellipse1.className = 'ellipse' + (col % 2 ? ' alt' : '');
                tile.appendChild(ellipse1);
				this.$patternContainer.append(tile);
            }
        }
	}

	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}