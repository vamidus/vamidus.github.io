class Main {
	constructor() {
		// Configs
		this.dob = new Date();

		// Selectors
		this.$ageCard = null;
		this.$ageText = null;
		this.$ageValues = null;
		this.$card = null;
		
		// Timer for midnight updates
		this.midnightTimer = null;
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
		this.scheduleMidnightUpdate();
	}

	setupElementSelectors() {
		this.$ageCard = $(".age-card");
		this.$ageText = $(".age-text");
		this.$ageValues = $(".age-value");
		this.$card = $(".card");
	}

	showAge() {
		const age = this.calculateAge();
		const isBirthday = age.months === 0 && age.days === 0;
		
		// Populate individual age cards
		this.$ageValues.eq(0).text(age.years); // Years
		this.$ageValues.eq(1).text(age.months); // Months  
		this.$ageValues.eq(2).text(age.days); // Days
		
		// Set the full age text below
		if (isBirthday) {
			this.$ageText.html(`🎉 Happy ${age.years}<sup>${this.getOrdinalSuffix(age.years)}</sup> Birthday! 🎉`);
			this.triggerBirthdayAnimation();
		} else {
			this.$ageText.text(`I am ${age.years} years, ${age.months} months, and ${age.days} days old.`);
		}
	}
	
	calculateAge() {
		//const today = new Date('1978-07-27');
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
	
	getOrdinalSuffix(number) {
		// Handle special cases for English ordinal suffixes
		const absNumber = Math.abs(number);
		const lastDigit = absNumber % 10;
		const lastTwoDigits = absNumber % 100;
		
		// 11th, 12th, 13th are exceptions
		if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
			return 'th';
		}
		
		// 1st, 2nd, 3rd
		switch (lastDigit) {
			case 1: return 'st';
			case 2: return 'nd';
			case 3: return 'rd';
			default: return 'th';
		}
	}
	
	triggerBirthdayAnimation() {
		// Add birthday class to trigger CSS animations
		this.$card.addClass('birthday-mode');
		this.$ageCard.addClass('birthday-card');
		
		// Create confetti effect
		this.createConfetti();
		
		// Pulse the age values
		this.$ageValues.addClass('birthday-pulse');
		
		// Remove classes after animation completes
		setTimeout(() => {
			this.$card.removeClass('birthday-mode');
			this.$ageCard.removeClass('birthday-card');
			this.$ageValues.removeClass('birthday-pulse');
		}, 5000);
	}
	
	createConfetti() {
		const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6ab04c'];
		const confettiCount = 150;
		
		for (let i = 0; i < confettiCount; i++) {
			const confetti = $('<div></div>').addClass('confetti-piece');
			confetti.css({
				'background-color': colors[Math.floor(Math.random() * colors.length)],
				'left': Math.random() * 100 + '%',
				'animation-delay': Math.random() * 3 + 's',
				'animation-duration': (Math.random() * 3 + 2) + 's'
			});
			$('body').append(confetti);
		}
		
		// Remove confetti after animation
		setTimeout(() => {
			$('.confetti-piece').remove();
		}, 15000);
	}
	
	scheduleMidnightUpdate() {
		// Clear any existing timer
		if (this.midnightTimer) {
			clearTimeout(this.midnightTimer);
		}
		
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0); // Set to midnight
		
		const msUntilMidnight = tomorrow.getTime() - now.getTime();
		
		// Set timer to update at midnight
		this.midnightTimer = setTimeout(() => {
			this.showAge();
			this.scheduleMidnightUpdate(); // Schedule next midnight update
		}, msUntilMidnight);
	}
	
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}