class Main {
	constructor() {
		// Configs
		this.dob = new Date();

		// Variables
		// Selectors
		this.$container = null;
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
		this.showAge();
	}

	setupElementSelectors() {
		this.$container = $(".container");
	}

	showAge() {
		const age = this.calculateAge();
		
		// Populate individual age cards
		$('.age-value').eq(0).text(age.years); // Years
		$('.age-value').eq(1).text(age.months); // Months  
		$('.age-value').eq(2).text(age.days); // Days
		
		// Set the full age text below
		$('.age-text').text(`${age.years} years, ${age.months} months, ${age.days} days`);
	}
	
	calculateAge() {
		const today = new Date();
		let years = today.getFullYear() - this.dob.getFullYear();
		let months = today.getMonth() - this.dob.getMonth();
		let days = today.getDate() - this.dob.getDate();

		// 1. Handle negative days
		if (days < 0) {
			months--;
			// Get the last day of the previous month
			const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
			days += prevMonth.getDate();
		}

		// 2. Handle negative months
		if (months < 0) {
			years--;
			months += 12;
		}

		return {years, months, days};
	}
	
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}