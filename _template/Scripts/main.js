class Main {
	constructor() {
		// Configs
		this.xxx = 0;

		// Variables
		// Selectors
		this.$xxx = null;
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
		this.setupXxx();
	}

	setupElementSelectors() {
		this.$xxx = $("xxx");
	}

	setupXxx() {
	}
	
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}