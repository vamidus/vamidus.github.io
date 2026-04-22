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
		const isBirthday = age.months === 0 && age.days === 0;
		
		// Populate individual age cards
		$('.age-value').eq(0).text(age.years); // Years
		$('.age-value').eq(1).text(age.months); // Months  
		$('.age-value').eq(2).text(age.days); // Days
		
		// Set the full age text below
		if (isBirthday) {
			$('.age-text').html(`🎉 Happy ${age.years}th Birthday! 🎉`);
			this.triggerBirthdayAnimation();
		} else {
			$('.age-text').text(`${age.years} years, ${age.months} months, ${age.days} days`);
		}
	}
	
	calculateAge() {
		//const today = new Date();
		const today = new Date('2026-07-27'); // TODO: Remove this line when not testing
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
	
	triggerBirthdayAnimation() {
		// Add birthday class to trigger CSS animations
		$('.card').addClass('birthday-mode');
		$('.age-card').addClass('birthday-card');
		
		// Create confetti effect
		this.createConfetti();
		
		// Pulse the age values
		$('.age-value').addClass('birthday-pulse');
		
		// Remove classes after animation completes
		setTimeout(() => {
			$('.card').removeClass('birthday-mode');
			$('.age-card').removeClass('birthday-card');
			$('.age-value').removeClass('birthday-pulse');
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
	
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}