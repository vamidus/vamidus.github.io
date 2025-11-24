class Main {
	constructor() {
		// Board state
		this.currentRow = 0;
		this.currentCol = 0;
		this.cookieName = 'ws_intro_dontshow';

		// Selectors
		this.$board = null;
		this.$keys = null;
		this.$enter = null;
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
		this.setupEventHandlers();
		this.initIntroModal();
		this.bindKeyboard();
		this.bindPhysicalKeyboard();
		this.bindTileClicks();
		this.initializeTileStates();
		this.updateEnterState();
	}

	setupElementSelectors() {
		this.$board = $('.board');
		this.$enter = $('.keyboard .key[data-key="Enter"]');
		this.$help = $('#help-button');
		this.$introClose = $('#introClose');
		this.$introDontShow = $('#introDontShow');
		this.$introModal = $('#introModal');
		this.$keys = $('.keyboard .key');
		this.$regexBox = $('#regexBox');
	}

	setupEventHandlers() {
		const self = this;
		this.$help.on('click', function () {
			self.$introModal.removeClass('d-none');
		});
		this.$introModal.on('click', '.intro-overlay', function () {
			self.$introModal.addClass('d-none');
		});
		this.$introClose.on('click', function () {
			self.$introModal.addClass('d-none');
		});
		this.$introDontShow.on('change', function () {
			if (this.checked) {
				self.setCookie(self.cookieName, '1', 365);
			} else {
				self.eraseCookie(self.cookieName);
			}
		});
	}

	initIntroModal() {
		const self = this;
		if (!this.$introModal || !this.$introModal.length) return;
		const val = this.getCookie(this.cookieName);
		if (val === '1') {
			this.$introModal.attr('hidden', 'hidden');
			return;
		}
		this.$introModal.removeAttr('hidden');
	}

	getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	setCookie(cname, cvalue, exdays) {
		const d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		let expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	eraseCookie(cname) {
		this.setCookie(cname, '', -1);
	}

	// Bind physical keyboard events so the on-screen keyboard reacts to hardware keys
	bindPhysicalKeyboard() {
		const self = this;
		// keydown to trigger actions (letters, enter, backspace)
		$(document).on('keydown.main', function (e) {
			// Ignore when modifier keys are held
			if (e.ctrlKey || e.altKey || e.metaKey) return;
			const k = e.key;
			if (!k) return;
			// Letters A-Z
			if (k.length === 1 && /[a-zA-Z]/.test(k)) {
				e.preventDefault();
				self.onLetter(k.toUpperCase());
				// add pressed visual to matching on-screen key
				try { self.$keys.filter(`[data-key="${k.toUpperCase()}"]`).addClass('pressed'); } catch (err) {}
				return;
			}
			if (k === 'Enter') {
				e.preventDefault();
				self.onEnter();
				try { self.$keys.filter('[data-key="Enter"]').addClass('pressed'); } catch (err) {}
				return;
			}
			if (k === 'Backspace') {
				e.preventDefault();
				self.onBackspace();
				try { self.$keys.filter('[data-key="Backspace"]').addClass('pressed'); } catch (err) {}
				return;
			}
		});

		// keyup to clear pressed visuals
		$(document).on('keyup.main', function (e) {
			const k = e.key;
			if (!k) return;
			let selector = null;
			if (k.length === 1 && /[a-zA-Z]/.test(k)) selector = `[data-key="${k.toUpperCase()}"]`;
			else if (k === 'Enter') selector = '[data-key="Enter"]';
			else if (k === 'Backspace') selector = '[data-key="Backspace"]';
			if (selector) {
				try { self.$keys.filter(selector).removeClass('pressed'); } catch (err) {}
			}
		});
	}

	// Initialize all tiles to the default state 'not-present'. They will
	// visually appear transparent but only become clickable once they contain
	// letters (JS will toggle the `clickable` class when letters are added).
	initializeTileStates() {
		this.$board.find('.tile').each(function () {
			const $t = $(this);
			$t.attr('data-state', 'not-present').removeClass('state-present state-guessed').addClass('state-not-present');
			$t.removeClass('clickable');
		});
		// Update key state visuals based on initial tile states
		this.updateKeyStates();
	}

	bindKeyboard() {
		const self = this;
		this.$keys.on('click', function (ev) {
			const key = $(this).attr('data-key');
			if (!key) return;

			if (key === 'Enter') {
				self.onEnter();
				return;
			}

			if (key === 'Backspace') {
				self.onBackspace();
				return;
			}

			// Letter key
			self.onLetter(key);
		});
	}

	// Allow cycling a tile's state when clicked, but only if it contains a letter.
	bindTileClicks() {
		const self = this;
		this.$board.on('click', '.tile', function (ev) {
			const $tile = $(this);
			const txt = $tile.text().trim();
			if (!txt) return; // only tiles that contain a letter participate

			let state = $tile.attr('data-state') || 'not-present';

			if (state === 'not-present') {
				state = 'present';
				$tile.attr('data-state', state).removeClass('state-not-present state-guessed').addClass('state-present');
				self.updateKeyStates();
				// If this was a tile in the last submitted row and that row is full,
				// regenerate the regex so the user sees the effect immediately.
				const row = parseInt($tile.attr('data-row'), 10);
				if (self.currentRow > 0 && row === self.currentRow - 1 && self.rowIsFull(row)) {
					self.computeAndRenderForRow(row);
				}
				return;
			}

			if (state === 'present') {
				state = 'guessed';
				$tile.attr('data-state', state).removeClass('state-not-present state-present').addClass('state-guessed');
				self.updateKeyStates();
				const row = parseInt($tile.attr('data-row'), 10);
				if (self.currentRow > 0 && row === self.currentRow - 1 && self.rowIsFull(row)) {
					self.computeAndRenderForRow(row);
				}
				return;
			}

			// state === 'guessed' -> cycle back to 'not-present'
			if (state === 'guessed') {
				state = 'not-present';
				$tile.attr('data-state', state).removeClass('state-present state-guessed').addClass('state-not-present');
				self.updateKeyStates();
				const row = parseInt($tile.attr('data-row'), 10);
				if (self.currentRow > 0 && row === self.currentRow - 1 && self.rowIsFull(row)) {
					self.computeAndRenderForRow(row);
				}
				return;
			}
		});
	}

	onLetter(letter) {
		if (this.currentCol >= 5) return; // ignore when row is full

		const $tile = this.getTile(this.currentRow, this.currentCol);
		if ($tile.length) {
			$tile.text(letter);
			// Make tile clickable now that it contains a letter
			$tile.addClass('clickable');
		}
		this.currentCol++;
		this.updateEnterState();
	}

	onBackspace() {
		// If at the start of the row, move back to the previous row that has
		// any filled tiles and delete the last filled tile there.
		if (this.currentCol === 0) {
			if (this.currentRow === 0) return; // nothing to delete anywhere
			// Walk backwards to find the previous row that contains a filled tile
			let found = false;
			let r = this.currentRow - 1;
			for (; r >= 0; r--) {
				// find last filled column in row r
				let lastFilled = -1;
				for (let c = 4; c >= 0; c--) {
					const $t = this.getTile(r, c);
					if ($t.length && ($t.text() || '').trim()) { lastFilled = c; break; }
				}
				if (lastFilled >= 0) {
					this.currentRow = r;
					this.currentCol = lastFilled + 1; // next free slot after lastFilled
					found = true;
					break;
				}
			}
			if (!found) return; // nothing to delete in any previous rows
		}
		// Now remove the previous letter in the current row
		this.currentCol = Math.max(0, this.currentCol - 1);
		const $tile = this.getTile(this.currentRow, this.currentCol);
		if ($tile.length) {
			$tile.text('');
			// Reset state to not-present and remove clickability for empty tile
			$tile.attr('data-state', 'not-present').removeClass('state-present state-guessed').addClass('state-not-present');
			$tile.removeClass('clickable');
		}
		this.updateKeyStates();
		this.updateEnterState();
	}

	onEnter() {
		// Allow submitting active row when full, or re-generating for the
		// previously submitted row if it is still full.
		if (this.currentCol === 5 && this.currentRow < 6) {
			// Compute and display regex for the active row
			const rowToCompute = this.currentRow;
			this.computeAndRenderForRow(rowToCompute);
			// Update key visuals after a submission in case tile states changed
			this.updateKeyStates();
			// Advance to next row only if not at the final row index
			if (this.currentRow < 5) {
				this.currentRow++;
				this.currentCol = 0;
			}
			this.updateEnterState();
			return;
		}
		// If active row not full, allow regenerating the regex for last submitted row
		if (this.currentRow > 0 && this.rowIsFull(this.currentRow - 1)) {
			this.computeAndRenderForRow(this.currentRow - 1);
			this.updateKeyStates();
			this.updateEnterState();
			return;
		}
		// otherwise nothing to do
		return;
	}

	// Parse a string that looks like a JS regex literal, e.g. '/^ABC$/i'
	parseRegexLiteral(literal) {
		if (!literal || typeof literal !== 'string') return null;
		const m = literal.match(/^\/(.*)\/([a-z]*)$/i);
		if (!m) return null;
		try {
			return new RegExp(m[1], m[2]);
		} catch (e) {
			console.error('Invalid regex literal:', literal, e);
			return null;
		}
	}

	// Check whether a given row has all 5 tiles filled with letters
	rowIsFull(row) {
		for (let c = 0; c < 5; c++) {
			const $t = this.getTile(row, c);
			if (!$t.length) return false;
			const ch = ($t.text() || '').trim();
			if (!ch) return false;
		}
		return true;
	}

	// Compute regex for a row, parse it and render matches
	computeAndRenderForRow(row) {
		const regexLiteral = this.updateRegexForRow(row);
		const regex = this.parseRegexLiteral(regexLiteral);
		if (regex) {
			const matches = this.searchWordsWithRegex(regex);
			this.renderMatches(matches);
		}
	}

	// Return up to a reasonable number of matches from this.words
	searchWordsWithRegex(regex, limit = 500) {
		if (!regex || !this.words || !Array.isArray(this.words)) return [];
		const res = [];
		for (let i = 0; i < this.words.length; i++) {
			const w = this.words[i];
			if (typeof w !== 'string') continue;
			if (regex.test(w)) {
				res.push(w);
				if (res.length >= limit) break;
			}
		}
		return res;
	}

	// Render matches into the #matches container
	renderMatches(matches) {
		const $out = $('#matches');
		if (!$out || !$out.length) return;
		$out.empty();
		if (!matches || matches.length === 0) {
			$out.text('No matches found in our 5757-word list.');
			return;
		}
		// Show count first
		const outMessage = matches.length === 1 ? 'Only 1 match!' : `${matches.length} matches`;
		$out.append(`<div class="match-count">${outMessage}</div>`);
		const $wrap = $('<div class="match-list"></div>');
		for (const m of matches) {
			const $it = $('<div class="match-item"></div>').text(m);
			$wrap.append($it);
			const $spacer = $('<span>&nbsp;</span>');
			$wrap.append($spacer);
		}
		$out.append($wrap);
	}

	// Build a regex for a 5-letter word based on the given row's tile letters and states.
	// - guessed: letter must be at that exact position
	// - present: letter must appear somewhere in the word but not at that position
	// - not-present: letter must not appear in the word at all
	updateRegexForRow(row) {
		const letters = [];
		const states = [];
		for (let c = 0; c < 5; c++) {
			const $t = this.getTile(row, c);
			const ch = ($t.text() || '').trim().toUpperCase();
			letters.push(ch);
			states.push(($t.attr('data-state') || 'not-present'));
		}

		// Build sets and position constraints
		const notPresentSet = new Set();
		const presentList = [];
		const fixed = Array(5).fill(null);

		for (let i = 0; i < 5; i++) {
			const ch = letters[i];
			const st = states[i];
			if (!ch) continue; // shouldn't happen for full row
			if (st === 'guessed') {
				fixed[i] = ch;
			}
			if (st === 'present') {
				presentList.push(ch);
			}
			if (st === 'not-present') {
				notPresentSet.add(ch);
			}
		}

		// Also collect global constraints across ALL submitted rows so 'not-present',
		// 'present' and 'guessed' markings from earlier rows can contribute to
		// the overall constraints. We'll then merge global fixed/present into
		// the current-row constraints so nothing is accidentally excluded.
		const globalNotPresentSet = new Set();
		const globalPresentList = [];
		const globalFixed = Array(5).fill(null);
		for (let r = 0; r < 6; r++) {
			for (let c = 0; c < 5; c++) {
				const $t = this.getTile(r, c);
				const ch = ($t.text() || '').trim().toUpperCase();
				const st = ($t.attr('data-state') || 'not-present');
				if (!ch) continue;
				if (st === 'guessed') {
					globalFixed[c] = ch;
				}
				if (st === 'present') {
					globalPresentList.push(ch);
				}
				if (st === 'not-present') {
					globalNotPresentSet.add(ch);
				}
			}
		}

		// Merge global fixed/present constraints into the current-row constraints
		for (let i = 0; i < 5; i++) {
			if (globalFixed[i]) fixed[i] = globalFixed[i];
		}
		const combinedPresentList = presentList.concat(globalPresentList);

		// Remove any letters from the global not-present set that were marked
		// present/guessed elsewhere so they aren't wrongly excluded.
		for (const ch of combinedPresentList) globalNotPresentSet.delete(ch);
		for (const ch of globalFixed) if (ch) globalNotPresentSet.delete(ch);

		// Helper to escape char for character class / regex
		function escapeForClass(s) {
			return s.replace(/[-\\\\\]\\^]/g, '\\$&');
		}

		// Positive lookaheads for present letters (ensure they exist somewhere)
		let lookaheads = '';
		const presentUnique = [...new Set(combinedPresentList)];
		for (const p of presentUnique) {
			lookaheads += `(?=.*${escapeForClass(p)})`;
		}

		// Negative lookahead for not-present letters
		let neg = '';
		if (globalNotPresentSet.size > 0) {
			const chars = [...globalNotPresentSet].join('');
			neg = `(?!.*[${escapeForClass(chars)}])`;
		}
		// Build per-position exclusion sets: start with global not-present letters,
		// then add any letters that were marked 'present' at that position in any row.
		const perPositionExcludes = Array.from({ length: 5 }, () => new Set());
		if (globalNotPresentSet.size > 0) {
			for (let i = 0; i < 5; i++) {
				for (const ch of globalNotPresentSet) perPositionExcludes[i].add(ch);
			}
		}
		// Add present-marked letters at their respective positions across all rows
		for (let r = 0; r < 6; r++) {
			for (let c = 0; c < 5; c++) {
				const $t = this.getTile(r, c);
				const ch = ($t.text() || '').trim().toUpperCase();
				const st = ($t.attr('data-state') || 'not-present');
				if (!ch) continue;
				if (st === 'present') perPositionExcludes[c].add(ch);
			}
		}

		// Build pattern for each position using the per-position excludes
		let pattern = '';
		for (let i = 0; i < 5; i++) {
			if (fixed[i]) {
				pattern += fixed[i];
				continue;
			}
			let exclude = '';
			if (perPositionExcludes[i].size > 0) exclude += [...perPositionExcludes[i]].join('');
			// Also ensure that if the current row marked this position as present,
			// it's included in the per-position excludes (already covered by scan above),
			// but keep the original behavior by falling back to letter list if needed.
			if (!exclude && states[i] === 'present') exclude += letters[i];
			if (exclude.length > 0) {
				pattern += `[^${escapeForClass(exclude)}]`;
			} else {
				pattern += '[A-Z]';
			}
		}

		const full = `^${lookaheads}${neg}${pattern}$`;
		const regexLiteral = `/${full}/i`;
		if (this.$regexBox && this.$regexBox.length) this.$regexBox.val(regexLiteral);
		return regexLiteral;
	}

	getTile(row, col) {
		return this.$board.find(`.tile[data-row="${row}"][data-col="${col}"]`);
	}

	// Update on-screen keyboard key styles according to aggregated tile states.
	updateKeyStates() {
		if (!this.$keys) return;
		const guessed = new Set();
		const present = new Set();
		const notpresent = new Set();
		for (let r = 0; r < 6; r++) {
			for (let c = 0; c < 5; c++) {
				const $t = this.getTile(r, c);
				const ch = ($t.text() || '').trim().toUpperCase();
				const st = ($t.attr('data-state') || 'not-present');
				if (!ch) continue;
				if (st === 'guessed') guessed.add(ch);
				else if (st === 'present') present.add(ch);
				else if (st === 'not-present') notpresent.add(ch);
			}
		}
		// Resolve priorities: guessed > present > not-present
		for (const ch of guessed) { present.delete(ch); notpresent.delete(ch); }
		for (const ch of present) { notpresent.delete(ch); }
		// Apply classes
		this.$keys.each((i, el) => {
			const $k = $(el);
			const key = $k.attr('data-key');
			if (!key || key.length !== 1) {
				// skip Enter/Backspace or other non-letter keys
				$k.removeClass('key--not-present key--present key--guessed');
				return;
			}
			const U = key.toUpperCase();
			$k.removeClass('key--not-present key--present key--guessed');
			if (guessed.has(U)) $k.addClass('key--guessed');
			else if (present.has(U)) $k.addClass('key--present');
			else if (notpresent.has(U)) $k.addClass('key--not-present');
		});
	}

	updateEnterState() {
		// Enable enter when the active row is full OR when the last submitted
		// row (currentRow-1) exists and is full so the user can regenerate.
		const activeFull = this.currentCol === 5;
		const lastFull = this.currentRow > 0 && this.rowIsFull(this.currentRow - 1);
		const enabled = activeFull || lastFull;
		this.$enter.prop('disabled', !enabled);
		if (enabled) this.$enter.addClass('enabled'); else this.$enter.removeClass('enabled');
	}


	static CreateInstance(settings) {
		const instance = new Main();
		instance.initialize(settings);
		return instance;
	}
}