class Main {
	constructor() {
		// Internationalization
		this.translations = {
			"game": {
				"en": "Game",
				"es": "Juego",
				"ja": "ゲーム",
				"ru": "Игра",
				"uk": "Гра"
			},
			"appearance": {
				"en": "Appearance",
				"es": "Apariencia",
				"ja": "外観",
				"ru": "Вид",
				"uk": "Вигляд"
			},
			"advanced": {
				"en": "Advanced",
				"es": "Avanzado",
				"ja": "詳細設定",
				"ru": "Продвинутые",
				"uk": "Розширені"
			},
			"about": {
				"en": "About",
				"es": "Acerca de",
				"ja": "概要",
				"ru": "О программе",
				"uk": "Про програму"
			},
			"play_as": {
				"en": "Play as:",
				"es": "Jugar como:",
				"ja": "プレイヤー:",
				"ru": "Играть за:",
				"uk": "Грати за:"
			},
			"white": {
				"en": "White",
				"es": "Blancas",
				"ja": "白",
				"ru": "Белые",
				"uk": "Білі"
			},
			"random": {
				"en": "Random",
				"es": "Aleatorio",
				"ja": "ランダム",
				"ru": "Случайно",
				"uk": "Випадково"
			},
			"black": {
				"en": "Black",
				"es": "Negras",
				"ja": "黒",
				"ru": "Черные",
				"uk": "Чорні"
			},
			"difficulty": {
				"en": "Difficulty:",
				"es": "Dificultad:",
				"ja": "難易度:",
				"ru": "Сложность:",
				"uk": "Складність:"
			},
			"new_game": {
				"en": "New Game",
				"es": "Nuevo Juego",
				"ja": "新しいゲーム",
				"ru": "Новая игра",
				"uk": "Нова гра"
			},
			"language": {
				"en": "Language:",
				"es": "Idioma:",
				"ja": "言語:",
				"ru": "Язык:",
				"uk": "Мова:"
			},
			"color_scheme": {
				"en": "Color scheme:",
				"es": "Esquema de colores:",
				"ja": "配色:",
				"ru": "Цветовая схема:",
				"uk": "Колірна схема:"
			},
			"light": {
				"en": "Light",
				"es": "Claro",
				"ja": "ライト",
				"ru": "Светлая",
				"uk": "Світла"
			},
			"dark": {
				"en": "Dark",
				"es": "Oscuro",
				"ja": "ダーク",
				"ru": "Темная",
				"uk": "Темна"
			},
			"auto": {
				"en": "Auto",
				"es": "Auto",
				"ja": "自動",
				"ru": "Авто",
				"uk": "Авто"
			},
			"highlighting": {
				"en": "Highlighting:",
				"es": "Resaltado:",
				"ja": "ハイライト:",
				"ru": "Подсветка:",
				"uk": "Підсвічування:"
			},
			"white_moves": {
				"en": "White",
				"es": "Blancas",
				"ja": "白",
				"ru": "Белые",
				"uk": "Білі"
			},
			"black_moves": {
				"en": "Black",
				"es": "Negras",
				"ja": "黒",
				"ru": "Черные",
				"uk": "Чорні"
			},
			"paste_game_state": {
				"en": "Paste game state here to import or copy from here to export",
				"es": "Pega el estado del juego aquí para importar o copia desde aquí para exportar",
				"ja": "ゲームの状態をここに貼り付けてインポートするか、ここからコピーしてエクスポートします",
				"ru": "Вставьте состояние игры сюда для импорта или скопируйте отсюда для экспорта",
				"uk": "Вставте стан гри сюди для імпорту або скопіюйте звідси для експорту"
			},
			"export_fen": {
				"en": "Export FEN",
				"es": "Exportar FEN",
				"ja": "FENをエクスポート",
				"ru": "Экспорт FEN",
				"uk": "Експорт FEN"
			},
			"import_fen": {
				"en": "Import FEN",
				"es": "Importar FEN",
				"ja": "FENをインポート",
				"ru": "Импорт FEN",
				"uk": "Імпорт FEN"
			},
			"about_p1": {
				"en": "It is I, <a href=\"https://github.com/vamidus/\" target=\"_blank\">Vamidus <span class=\"external-link-indicator\">⧉</span></a>, who built this little chess game as a fun project to practice my web development skills. I handled the front-end, making the UI work and ensuring it looks decent on your screen. You might notice the computer player is pretty smart; that's thanks to an external chess engine I integrated.",
				"es": "Soy yo, <a href=\"https://github.com/vamidus/\" target=\"_blank\">Vamidus <span class=\"external-link-indicator\">⧉</span></a>, quien construyó este pequeño juego de ajedrez como un proyecto divertido para practicar mis habilidades de desarrollo web. Me encargué del front-end, haciendo que la interfaz de usuario funcione y asegurándome de que se vea decente en tu pantalla. Notarás que el jugador de la computadora es bastante inteligente; eso es gracias a un motor de ajedrez externo que integré.",
				"ja": "この小さなチェスゲームを作成したのは、ウェブ開発スキルを練習するための楽しいプロジェクトとして、私、<a href=\"https://github.com/vamidus/\" target=\"_blank\">Vamidus <span class=\"external-link-indicator\">⧉</span></a>です。私はフロントエンドを担当し、UIが機能し、画面上で見栄えが良くなるようにしました。コンピュータープレイヤーがかなり賢いことにお気付きかもしれませんが、それは私が統合した外部のチェスエンジンのおかげです。",
				"ru": "Это я, <a href=\"https://github.com/vamidus/\" target=\"_blank\">Vamidus <span class=\"external-link-indicator\">⧉</span></a>, создал эту маленькую шахматную игру в качестве забавного проекта для практики своих навыков веб-разработки. Я занимался фронтендом, заставляя пользовательский интерфейс работать и обеспечивая его достойный вид на вашем экране. Вы могли заметить, что компьютерный игрок довольно умен; это благодаря внешнему шахматному движку, который я интегрировал.",
				"uk": "Це я, <a href=\"https://github.com/vamidus/\" target=\"_blank\">Vamidus <span class=\"external-link-indicator\">⧉</span></a>, створив цю маленьку шахову гру як веселий проект для практики своїх навичок у веб-розробці. Я займався фронтендом, змушуючи користувальницький інтерфейс працювати та забезпечуючи його пристойний вигляд на вашому екрані. Ви могли помітити, що комп'ютерний гравець досить розумний; це завдяки зовнішньому шаховому рушію, який я інтегрував."
			},
			"about_p2": {
				"en": "It's powered by the \"p4wn\" engine under the hood, which handles all the deep thinking for the computer's moves. I didn't write that part myself; I simply integrated this awesome open-source technology so you have a challenging opponent to play against!",
				"es": "Está impulsado por el motor \"p4wn\" bajo el capó, que se encarga de todo el pensamiento profundo para los movimientos de la computadora. No escribí esa parte yo mismo; simplemente integré esta increíble tecnología de código abierto para que tengas un oponente desafiante contra quien jugar.",
				"ja": "これは、コンピューターの動きのすべての深い思考を処理する「p4wn」エンジンによって内部で動いています。私はその部分を自分で書いたわけではありません。この素晴らしいオープンソース技術を統合しただけで、挑戦的な対戦相手と対戦できます！",
				"ru": "Он работает на движке \"p4wn\", который отвечает за все глубокие размышления о ходах компьютера. Я не писал эту часть сам; я просто интегрировал эту замечательную технологию с открытым исходным кодом, чтобы у вас был сложный противник для игры!",
				"uk": "Він працює на рушії \"p4wn\", який відповідає за всі глибокі роздуми над ходами комп'ютера. Я не писав цю частину сам; я просто інтегрував цю чудову технологію з відкритим кодом, щоб у вас був складний супротивник для гри!"
			},
			"about_p3": {
				"en": "I hope you have a great time playing a few games. If you're interested in checking out the tech that makes the opponent tick, check out the <a href=\"https://github.com/douglasbagnall/p4wn\" target=\"_blank\">p4wn engine GitHub page <span class=\"external-link-indicator\">⧉</span></a> – the folks who built it are the real MVPs behind the AI. Enjoy the game!",
				"es": "Espero que te diviertas mucho jugando algunas partidas. Si estás interesado en ver la tecnología que hace que el oponente funcione, echa un vistazo a la <a href=\"https://github.com/douglasbagnall/p4wn\" target=\"_blank\">página de GitHub del motor p4wn <span class=\"external-link-indicator\">⧉</span></a> – la gente que lo construyó son los verdaderos MVP detrás de la IA. ¡Disfruta del juego!",
				"ja": "いくつかのゲームを楽しんでいただければ幸いです。対戦相手を動かす技術に興味がある場合は、<a href=\"https://github.com/douglasbagnall/p4wn\" target=\"_blank\">p4wnエンジンのGitHubページ<span class=\"external-link-indicator\">⧉</span></a>をチェックしてください – それを構築した人々がAIの背後にいる真のMVPです。ゲームをお楽しみください！",
				"ru": "Надеюсь, вы отлично проведете время, сыграв несколько партий. Если вам интересно ознакомиться с технологией, которая заставляет противника работать, посетите <a href=\"https://github.com/douglasbagnall/p4wn\" target=\"_blank\">страницу движка p4wn на GitHub <span class=\"external-link-indicator\">⧉</span></a> – люди, которые его создали, являются настоящими MVP, стоящими за ИИ. Наслаждайтесь игрой!",
				"uk": "Сподіваюся, ви чудово проведете час, зігравши кілька партій. Якщо вам цікаво ознайомитися з технологією, яка змушує супротивника працювати, відвідайте <a href=\"https://github.com/douglasbagnall/p4wn\" target=\"_blank\">сторінку рушія p4wn на GitHub <span class=\"external-link-indicator\">⧉</span></a> – люди, які його створили, є справжніми MVP, що стоять за ШІ. Насолоджуйтесь грою!"
			},
			"close": {
				"en": "Close",
				"es": "Cerrar",
				"ja": "閉じる",
				"ru": "Закрыть",
				"uk": "Закрити"
			},
			"chess_title": {
				"en": "Chess",
				"es": "Ajedrez",
				"ja": "チェス",
				"ru": "Шахматы",
				"uk": "Шахи"
			},
			"play_again": {
				"en": "Play Again",
				"es": "Jugar de Nuevo",
				"ja": "もう一度プレイ",
				"ru": "Играть снова",
				"uk": "Грати знову"
			},
			"chess_toast_title": {
				"en": "Chess",
				"es": "Ajedrez",
				"ja": "チェス",
				"ru": "Шахматы",
				"uk": "Шахи"
			}
		};
		this.languages = [
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Español' },
            { code: 'ja', name: '日本語' },
            { code: 'ru', name: 'Русский' },
            { code: 'uk', name: 'Українська' }
        ];

		// Configs
		this.board_height = 8;
		this.board_width = 8;

		this.class_black = "black";
		this.class_white = "white";
		this.class_legend = "legend";
		this.class_square = "square";
		this.class_rank = "rank";

		this.scale_range = 1 / 720;

		this.pieces = ["♔♕♖♗♘♙", "♚♛♜♝♞♟︎"];
		this.square_files = "abcdefgh";
		this.square_ranks = "87654321";
		this.square_size = 64;
		this.square_black = "grey";
		this.square_white = "white";

		// Map p4wn engine piece types to their character index in this.pieces strings
		// P4_PAWN, P4_ROOK, etc. are global constants from engine.js
		this.pieceCharIndexMap = {
			2: 5,   // P4_PAWN -> ♙ / ♟︎ (index 5 in "♔♕♖♗♘♙" and "♚♛♜♝♞♟︎")
			4: 2,   // P4_ROOK -> ♖ / ♜ (index 2)
			6: 4,   // P4_KNIGHT -> ♘ / ♞ (index 4)
			8: 3,   // P4_BISHOP -> ♗ / ♝ (index 3)
			10: 0,  // P4_KING -> ♔ / ♚ (index 0)
			12: 1   // P4_QUEEN -> ♕ / ♛ (index 1)
		};

		// Variables
		this.state = null;

		this.player_type = ["Human", "Computer"];
		this.current_player_types = [0, 0]; // 1st element ot the array will play as White, 2nd element ot the array will play as Black
		this.depth = 0;

		this.dragged_from_square = "";
		this.dragged_over_square = "";
		this.selected_square = "";
		this.selected_square_node = null;
		
		this.lastMoveWhite = null;
		this.lastMoveBlack = null;
		this.moveHistory = [];		

		this.timeout_handle = null;

		// Selectors
		this.$board = null;
		this.$menuIcon = null;
		this.$menuContainer = null;
		this.$menu = null;
		this.$okButton = null;
		this.$difficultySlider = null;
		this.$newGameButton = null;
		this.$highlightSwitch = null;
		this.$moveHistoryBody = null;
		this.$moveHistoryContainer = null;
		this.$gameStateTextarea = null;
		this.$exportGameStateButton = null;
		this.$importGameStateButton = null;
		this.$languageSelect = null;
	}
	
	initialize(settings) {
		if (settings) this.applySettings(settings);
		this.setup();

		// Language
		this.populateLanguageOptions();
		const language = this.getLanguage();
		this.setLanguage(language);
		this.$languageSelect.val(language);

		// Play as
		const playAs = this.getPlayAs();
		$(`#${playAs}`).prop('checked', true);

		// Difficulty
		const difficulty = this.getDifficulty();
		this.$difficultySlider.val(difficulty);

		// Color scheme
		const preferredScheme = this.getPreferredColorScheme();
		this.setColorScheme(preferredScheme);
		$(`#${preferredScheme}-scheme`).prop('checked', true);

		// Highlighting
		const highlighting = this.getHighlighting();
		this.$highlightSwitch.prop('checked', highlighting);
		this.setHighlighting(highlighting);

		this.startNewGame();
	}

	applySettings(settings) {
		$.extend(this, settings);
	}

	setup() {
		this.setupElementSelectors();
		this.setupEventListeners();
		this.setCssVariables();
		this.scaleBoard();
	}

	setupElementSelectors() {
		this.$board = $(".board:first");
		this.$menuIcon = $("#menu-icon");
		this.$menuContainer = $(".menu-container");
		this.$menu = $(".menu");
		this.$okButton = $("#ok-button");
		this.$difficultySlider = $("#difficulty-slider");
		this.$newGameButton = $("#new-game-button");
		this.$highlightSwitch = $("#highlight-switch");
		this.$moveHistoryBody = $("#move-history-body");
		this.$moveHistoryContainer = $(".move-history-container");
		this.$gameStateTextarea = $("#game-state-textarea");
		this.$exportGameStateButton = $("#export-game-state-button");
		this.$importGameStateButton = $("#import-game-state-button");
		this.$languageSelect = $("#language-select");
	}

	setupEventListeners() {
		$(window).on("resize", this.scaleBoard.bind(this));
		this.$menuIcon.on("click", () => {
			this.$menuContainer.toggleClass("open");
		});
		this.$okButton.on("click", () => {
			this.$menuContainer.removeClass("open");
		});
		this.$menuContainer.on("click", (e) => {
			if (e.target === this.$menuContainer[0]) {
				this.$menuContainer.removeClass("open");
			}
		});
		this.$newGameButton.on("click", () => {
			window.location.reload();
		});
		$('input[name="color-scheme"]').on('change', (e) => {
			this.setColorScheme(e.target.id.split('-')[0]);
		});
		this.$difficultySlider.on('input', (e) => {
			this.depth = e.target.value;
			localStorage.setItem('difficulty', this.depth);
		});
		this.$highlightSwitch.on('change', (e) => {
			this.setHighlighting(e.target.checked);
		});
		$('input[name="play-as"]').on('change', (e) => {
			localStorage.setItem('play-as', e.target.id);
		});
		this.$board.on("click", ".square", (e) => this.handleSquareClick(e.currentTarget));
		this.$exportGameStateButton.on("click", () => this.exportGameState());
		this.$importGameStateButton.on("click", () => this.importGameState());
		this.$languageSelect.on('change', (e) => {
			this.setLanguage(e.target.value);
		});
	}

	getPlayAs() {
		const savedPlayAs = localStorage.getItem('play-as');
		if (savedPlayAs) {
			return savedPlayAs;
		} else {
			return 'play-as-white';
		}
	}

	setColorScheme(scheme) {
		const root = document.documentElement;
		if (scheme === 'auto') {
			root.classList.remove('light-theme', 'dark-theme');
			localStorage.removeItem('color-scheme');
		} else {
			root.classList.remove('light-theme', 'dark-theme');
			root.classList.add(scheme + '-theme');
			localStorage.setItem('color-scheme', scheme);
		}
	}

	getPreferredColorScheme() {
		const savedScheme = localStorage.getItem('color-scheme');
		if (savedScheme) {
			return savedScheme;
		} else {
			return 'auto';
		}
	}

	getDifficulty() {
		const savedDifficulty = localStorage.getItem('difficulty');
		if (savedDifficulty) {
			return parseInt(savedDifficulty, 10);
		} else {
			return 0; // Easy
		}
	}

	getHighlighting() {
		const savedHighlighting = localStorage.getItem('highlighting');
		if (savedHighlighting) {
			return savedHighlighting === 'true';
		} else {
			return true; // Default to true
		}
	}

	setHighlighting(enabled) {
		localStorage.setItem('highlighting', enabled);
		if (enabled) {
			this.$board.removeClass('no-highlight');
		} else {
			this.$board.addClass('no-highlight');
		}
	}

	populateLanguageOptions() {
        this.languages.forEach(lang => {
            const option = new Option(lang.name, lang.code);
            this.$languageSelect.append(option);
        });
    }

    applyTranslations(language) {
        $('[data-translate-key]').each((index, element) => {
            const key = $(element).data('translate-key');
            if (this.translations[key] && this.translations[key][language]) {
                if (element.tagName === 'TEXTAREA') {
                    $(element).attr('placeholder', this.translations[key][language]);
                } else {
                    $(element).html(this.translations[key][language]);
                }
            }
        });
    }

    setLanguage(language) {
        localStorage.setItem('language', language);
        this.applyTranslations(language);
    }

    getLanguage() {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            return savedLanguage;
        }

        const browserLanguage = navigator.language.split('-')[0];
        const supportedLanguages = this.languages.map(lang => lang.code);
        if (supportedLanguages.includes(browserLanguage)) {
            return browserLanguage;
        }

        return 'en';
    }

	setCssVariables() {
		document.documentElement.style.setProperty("--square-black", this.square_black);
		document.documentElement.style.setProperty("--square-white", this.square_white);
	}

	scaleBoard() {
		const $container = this.$board.parent();
		const scale = this.scale_range * Math.min($container.innerWidth(), $container.innerHeight());
		document.documentElement.style.setProperty("--square-size", `${this.square_size * scale}px`);
	}

	updateBoardUI(setupDraggable = true) {
		// Clear previous highlights
		this.$board.find('.highlight-from-white, .highlight-to-white, .highlight-from-black, .highlight-to-black, .highlight-possible-move, .highlight-selected, .highlight-check')
			.removeClass('highlight-from-white highlight-to-white highlight-from-black highlight-to-black highlight-possible-move highlight-selected highlight-check');

		if (this.lastMoveWhite) {
			const { from, to, color } = this.lastMoveWhite;
			this.$board.find(`[data-square=${from}]`).addClass(`highlight-from-${color}`);
			this.$board.find(`[data-square=${to}]`).addClass(`highlight-to-${color}`);
		}

		if (this.lastMoveBlack) {
			const { from, to, color } = this.lastMoveBlack;
			this.$board.find(`[data-square=${from}]`).addClass(`highlight-from-${color}`);
			this.$board.find(`[data-square=${to}]`).addClass(`highlight-to-${color}`);
		}

		this.highlightCheck();

		// Clear all piece spans from the board squares
		this.$board.find(".square span").remove();
		// Redraw pieces based on the current game state
		this.drawBoard();
		// Re-enable dragging for the current player's pieces, unless asked not to
		if (setupDraggable) this.setupDraggable();
	}

	startNewGame() {
		this.clearMoveHistory();
		this.setGameParameters();
		this.setupBoard();
		this.state = p4_new_game();
		this.updateBoardUI();
		if (this.player_type[this.current_player_types[this.state.to_play]] === "Computer") { // true if human is playing black
			this.timeout_handle = setTimeout(() => this.getComputerMove(), 10);
		}
	}

	setupBoard() {
		let colorIsBlack = true;
		this.$board.empty();

		let square_files = this.square_files;
		let square_ranks = this.square_ranks;

		// If the user is playing as black, reverse the board
		if (this.current_player_types[0] === 1) {
			square_files = square_files.split('').reverse().join('');
			square_ranks = square_ranks.split('').reverse().join('');
		}

		for (let y = -1; y < this.board_height + 1; y++) {
			let $newRow = $("<div />").addClass(this.class_rank);
			for (let x = -1; x < this.board_width + 1; x++) {
				if (y > -1 && y < this.board_height && x > -1 && x < this.board_width) {
					$("<div />")
						.addClass(colorIsBlack ? this.class_black : this.class_white)
						.addClass(this.class_square)
						.attr("id", "square-x" + x + "-y" + y)
						.attr("data-square", square_files.charAt(x) + square_ranks.charAt(y))
						.data("x", x)
						.data("y", y)
						.appendTo($newRow);
					colorIsBlack = !colorIsBlack;
				} else if ((y === -1 || y === this.board_height) && x > -1 && x < this.board_width) {
					$("<div />")
						.addClass(this.class_legend)
						.text(square_files.charAt(x))
						.appendTo($newRow);
				} else if (y > -1 && y < this.board_height && ( x === -1 || x === this.board_width)) {
					$("<div />")
						.addClass(this.class_legend)
						.html(square_ranks.charAt(y))
						.appendTo($newRow);
				} else {
					$("<div />")
						.addClass(this.class_legend)
						.appendTo($newRow);
				}
			}
			$newRow.appendTo(this.$board);
			colorIsBlack = !colorIsBlack;
		}
	}

	setGameParameters() {
		this.current_player_types = this.getCurrentPlayerTypes();
		this.depth = this.$difficultySlider.val();
	}

	getCurrentPlayerTypes() {
		switch ($('input[name="play-as"]:checked').attr('id')) {
			case 'play-as-white':
				return [0, 1];
			case 'play-as-black':
				return [1, 0];
			case 'play-as-random':
				return Math.random() < 0.5 ? [0, 1] : [1, 0];
		}
	}

	drawBoard() {
		const isFlipped = this.current_player_types[0] === 1;

		for (let y = 9; y > 1; y--) {
			for (let x = 1; x < 9; x++) {
				const i = y * 10 + x;
				const piece = this.getPieceFromP4Index(this.state.board[i]);
				const pieceColor = this.getPieceColorFromP4Index(this.state.board[i]);
				if (piece && pieceColor) {
					const file = isFlipped ? this.square_files.charAt(8 - x) : this.square_files.charAt(x - 1);
					const rank = isFlipped ? this.square_ranks.charAt(y - 2) : this.square_ranks.charAt(9 - y);
					$(`[data-square='${file}${rank}']`).html(`<span class='${pieceColor}'>${piece}</span>`);
				}
			}
		}
	}

	getPieceFromP4Index(index) {
		if (!index) return null;
		const colorIndex = index & 1; // 0 for white, 1 for black
		const pieceType = index & 14; // P4_PAWN, P4_ROOK, etc. (even numbers)
		const charIndex = this.pieceCharIndexMap[pieceType];
		if (charIndex !== undefined) {
			return this.pieces[colorIndex].charAt(charIndex);
		}
		return null;
	}

	getPieceColorFromP4Index(index) {
		if (!index) return null;
		// Even indices are white (index & 1 === 0), odd are black (index & 1 === 1)
		return (index & 1) === 0 ? this.class_white : this.class_black;
	}

	highlightCheck() {
		p4_maybe_prepare(this.state);
		const inCheck = p4_check_check(this.state, this.state.to_play);
		if (!inCheck) return;

		const kingPiece = this.state.to_play === 0 ? P4_KING : P4_KING | 1;
		let kingPosition = -1;

		// Find the king's position
		for (let i = 0; i < this.state.pieces[this.state.to_play].length; i++) {
			const piece = this.state.pieces[this.state.to_play][i];
			if (piece[0] === kingPiece) {
				kingPosition = piece[1];
				break;
			}
		}

		if (kingPosition !== -1) {
			const kingSquare = p4_stringify_point(kingPosition);
			this.$board.find(`[data-square=${kingSquare}]`).addClass('highlight-check');

			// Find the checking piece
			const opponentColor = 1 - this.state.to_play;
			const board = this.state.board;
			const s = kingPosition;
			const dir = 10 - 20 * this.state.to_play;

			// Pawn attacks
			let attackerPos = s + dir - 1;
			if (board[attackerPos] === (P4_PAWN | opponentColor)) {
				this.$board.find(`[data-square=${p4_stringify_point(attackerPos)}]`).addClass('highlight-check');
				return;
			}
			attackerPos = s + dir + 1;
			if (board[attackerPos] === (P4_PAWN | opponentColor)) {
				this.$board.find(`[data-square=${p4_stringify_point(attackerPos)}]`).addClass('highlight-check');
				return;
			}

			// Knight attacks
			const knight_moves = P4_MOVES[P4_KNIGHT];
			const knight = P4_KNIGHT | opponentColor;
			for (let i = 0; i < 8; i++) {
				attackerPos = s + knight_moves[i];
				if (board[attackerPos] === knight) {
					this.$board.find(`[data-square=${p4_stringify_point(attackerPos)}]`).addClass('highlight-check');
					return;
				}
			}
			
			// King attacks
			const king_moves = P4_MOVES[P4_KING];
			const king = P4_KING | opponentColor;
			for (let i = 0; i < 8; i++) {
				attackerPos = s + king_moves[i];
				if (board[attackerPos] === king) {
					this.$board.find(`[data-square=${p4_stringify_point(attackerPos)}]`).addClass('highlight-check');
					return;
				}
			}

			// Diagonal and grid attacks
			const diagonal_moves = P4_MOVES[P4_BISHOP];
			const grid_moves = P4_MOVES[P4_ROOK];
			const diag_slider = P4_BISHOP | opponentColor;
			const diag_mask = 27;
			const grid_slider = P4_ROOK | opponentColor;
			const grid_mask = 23;

			for (let i = 0; i < 4; i++) {
				let m = diagonal_moves[i];
				let e = s;
				let E;
				do {
					e += m;
					E = board[e];
				} while (!E);
				if ((E & diag_mask) === diag_slider) {
					this.$board.find(`[data-square=${p4_stringify_point(e)}]`).addClass('highlight-check');
					return;
				}

				m = grid_moves[i];
				e = s;
				do {
					e += m;
					E = board[e];
				} while (!E);
				if ((E & grid_mask) === grid_slider) {
					this.$board.find(`[data-square=${p4_stringify_point(e)}]`).addClass('highlight-check');
					return;
				}
			}
		}
	}

	setupDraggable() {
		let draggableSelector = "";
		const humanPlayerType = this.player_type.indexOf("Human");
		if (this.state.to_play === 0 && this.current_player_types[0] === humanPlayerType) { // White's turn and human is playing white
			draggableSelector = `span.${this.class_white}`;
		} else if (this.state.to_play === 1 && this.current_player_types[1] === humanPlayerType) { // Black's turn and human is playing black
			draggableSelector = `span.${this.class_black}`;
		}
		this.$board.find(`${draggableSelector}`).draggable({
			start: (event, ui) => {
				const el = this.allElementsFromPoint(event.pageX, event.pageY);
				this.dragged_from_square = $(el).filter(".square").not(ui.helper).first().data("square");
				p4_maybe_prepare(this.state);
				const moves = p4_parse(this.state, this.state.to_play, this.state.enpassant, 0);
				const from_square_p4 = p4_destringify_point(this.dragged_from_square);
				for (const move of moves) {
					if (move[1] === from_square_p4) {
						const to_square = p4_stringify_point(move[2]);
						this.$board.find(`[data-square=${to_square}]`).addClass('highlight-possible-move');
					}
				}
			},
			stop: (event, ui) => {
				this.$board.find('.highlight-possible-move').removeClass('highlight-possible-move');
				const el = this.allElementsFromPoint(event.pageX, event.pageY);
				this.dragged_over_square = $(el).filter(".square").not(ui.helper).first().data("square");
				const movedColor = this.state.to_play === 0 ? this.class_white : this.class_black;
				const result = this.state.move(`${this.dragged_from_square}-${this.dragged_over_square}`); // TODO: add optional promotion argument when hitting last row (Qq, Rr, Bb, Nn)
				if (result.ok) {
					const lastMove = {
						from: this.dragged_from_square,
						to: this.dragged_over_square,
						color: movedColor,
						notation: result.string
					};
					if (lastMove.color === this.class_white) {
						this.lastMoveWhite = lastMove;
						this.moveHistory.push([lastMove.notation]);
					} else {
						this.lastMoveBlack = lastMove;
						this.moveHistory[this.moveHistory.length - 1].push(lastMove.notation);
					}
					this.updateBoardUI();
					this.updateMoveHistory();
					if (result.flags & P4_MOVE_FLAG_MATE) {
						this.updateBoardUI(false);
						setTimeout(() => {
							const modalBody = document.getElementById('game-over-modal-body');
							modalBody.innerHTML = "Congratulations, You won!";
							const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
							gameOverModal.show();
						}, 10);
					} else if (this.timeout_handle === null) {
						if (this.player_type[this.current_player_types[this.state.to_play]] === "Computer") { // Computer's turn
							this.timeout_handle = setTimeout(() => this.getComputerMove(), 10);
						}
					}
				} else {
					this.updateBoardUI();
				}
			}
		});
	}

	allElementsFromPoint(x, y) {
		let element;
		const elements = [];
		const old_visibility = [];
		while (true) {
			element = document.elementFromPoint(x, y);
			if (!element || element === document.documentElement) {
				break;
			}
			elements.push(element);
			old_visibility.push(element.style.visibility);
			element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
		}
		for (let i = 0; i < elements.length; i++) {
			elements[i].style.visibility = old_visibility[i];
		}
		elements.reverse();

		return elements;
	}

	getComputerMove() {
		const startTime = Date.now();
		let localDepth = this.depth;
		let moves = this.state.findmove(localDepth);
		let delta = Date.now() - startTime;
		if (localDepth > 2) {
			const minTime = 25 * localDepth;
			while (delta < minTime) {
				localDepth++;
				moves = this.state.findmove(localDepth);
				delta = Date.now() - startTime;
			}
		}
		if (!moves || (moves[0] === 0 && moves[1] === 0)) {
			this.updateBoardUI(false);
			const modalBody = document.getElementById('game-over-modal-body');
			if (p4_check_check(this.state, this.state.to_play)) {
				modalBody.innerHTML = "Checkmate!";
			} else {
				modalBody.innerHTML = "Stalemate!";
			}
			const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
			gameOverModal.show();
			return;
		}
		const movedColor = this.state.to_play === 0 ? this.class_white : this.class_black;
		const result = this.state.move(moves[0], moves[1]);
		if (result.ok) {
			const lastMove = {
				from: p4_stringify_point(moves[0]),
				to: p4_stringify_point(moves[1]),
				color: movedColor,
				notation: result.string
			};
			if (lastMove.color === this.class_white) {
				this.lastMoveWhite = lastMove;
				this.moveHistory.push([lastMove.notation]);
			} else {
				this.lastMoveBlack = lastMove;
				this.moveHistory[this.moveHistory.length - 1].push(lastMove.notation);
			}
			this.updateBoardUI();
			this.updateMoveHistory();
			clearTimeout(this.timeout_handle);
			this.timeout_handle = null;
			if (result.flags & P4_MOVE_FLAG_MATE) {
				this.updateBoardUI(false);
				setTimeout(() => {
					const modalBody = document.getElementById('game-over-modal-body');
					modalBody.innerHTML = "Checkmate!";
					const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
					gameOverModal.show();
				}, 10);
			} else {
				if (this.player_type[this.current_player_types[this.state.to_play]] === "Computer") { // Computer's turn (again?)
					this.timeout_handle = setTimeout(() => this.getComputerMove(), 10);
				}
			}
		}
		return result;
	}

	handleSquareClick(clickedSquare) {
		const humanPlayerType = this.player_type.indexOf("Human");
		if (this.current_player_types[this.state.to_play] !== humanPlayerType) { // Not human player's turn
			return;
		}

		const clickedSquareData = $(clickedSquare).data("square");

		if (this.selected_square === "") {
			this.selectPiece(clickedSquare, clickedSquareData);
		} else {
			if (this.selected_square === clickedSquareData) {
				this.deselectPiece();
			} else {
				this.movePiece(this.selected_square, clickedSquareData);
			}
		}
	}

	selectPiece(squareElement, squareData) {
		const pieceColor = this.getPieceColorFromP4Index(this.state.board[p4_destringify_point(squareData)]);
		const currentPlayerColor = this.state.to_play === 0 ? this.class_white : this.class_black;

		if (pieceColor === currentPlayerColor) {
			this.selected_square = squareData;
			this.selected_square_node = squareElement;
			$(this.selected_square_node).addClass('highlight-selected');

			p4_maybe_prepare(this.state);
			const moves = p4_parse(this.state, this.state.to_play, this.state.enpassant, 0);
			const from_square_p4 = p4_destringify_point(this.selected_square);

			for (const move of moves) {
				if (move[1] === from_square_p4) {
					const to_square = p4_stringify_point(move[2]);
					this.$board.find(`[data-square=${to_square}]`).addClass('highlight-possible-move');
				}
			}
		}
	}

	deselectPiece() {
		$(this.selected_square_node).removeClass('highlight-selected');
		this.$board.find('.highlight-possible-move').removeClass('highlight-possible-move');
		this.selected_square = "";
		this.selected_square_node = null;
	}

	movePiece(from, to) {
		const movedColor = this.state.to_play === 0 ? this.class_white : this.class_black;
		const result = this.state.move(`${from}-${to}`);
		if (result.ok) {
			const lastMove = {
				from: from,
				to: to,
				color: movedColor,
				notation: result.string
			};
			if (lastMove.color === this.class_white) {
				this.lastMoveWhite = lastMove;
				this.moveHistory.push([lastMove.notation]);
			} else {
				this.lastMoveBlack = lastMove;
				this.moveHistory[this.moveHistory.length - 1].push(lastMove.notation);
			}
			this.deselectPiece();
			this.updateBoardUI();
			this.updateMoveHistory();
			if (result.flags & P4_MOVE_FLAG_MATE) {
				this.updateBoardUI(false);
				setTimeout(() => {
					const modalBody = document.getElementById('game-over-modal-body');
					modalBody.innerHTML = "Congratulations, You won!";
					const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
					gameOverModal.show();
				}, 10);
			} else if (this.player_type[this.current_player_types[this.state.to_play]] === "Computer") { // Computer's turn
				this.timeout_handle = setTimeout(() => this.getComputerMove(), 10);
			}
		} else {
			this.deselectPiece();
		}
	}

	clearMoveHistory() {
		this.lastMoveWhite = null;
		this.lastMoveBlack = null;
		this.moveHistory = [];
		this.$moveHistoryBody.empty();
	}

	updateMoveHistory() {
		this.$moveHistoryBody.empty();
		this.moveHistory.forEach((movePair, index) => {
			const moveNumber = index + 1;
			const whiteMove = movePair[0] || '';
			const blackMove = movePair[1] || '';
			const row = `<tr><th scope="row">${moveNumber}</th><td>${whiteMove}</td><td>${blackMove}</td></tr>`;
			this.$moveHistoryBody.append(row);
		});
		const container = this.$moveHistoryContainer;
		if (container[0].scrollHeight > container[0].clientHeight) {
			container.scrollTop(container[0].scrollHeight);
		}
	}

	showToast(message) {
		const toastLiveExample = document.getElementById('liveToast');
		const toastBody = toastLiveExample.querySelector('.toast-body');
		toastBody.textContent = message;
		const toast = new bootstrap.Toast(toastLiveExample);
		toast.show();
	}

	exportGameState() {
		const fen = p4_state2fen(this.state);
		this.$gameStateTextarea.val(fen);
		navigator.clipboard.writeText(fen).then(() => {
			this.showToast("Game state (FEN) copied to clipboard!");
		}).catch(err => {
			console.error("Failed to copy game state: ", err);
			this.showToast("Failed to copy game state to clipboard.");
		});
	}

	importGameState() {
		const fen = this.$gameStateTextarea.val();
		if (fen) {
			try {
				this.state = p4_fen2state(fen);
				this.clearMoveHistory();
				this.updateBoardUI();
				this.$menuContainer.removeClass("open");
				this.showToast("Game state imported successfully!");
			} catch (e) {
				console.error("Failed to import game state: ", e);
				this.showToast("Invalid game state (FEN) provided.");
			}
		} else {
			this.showToast("Please paste a game state (FEN) into the text area.");
		}
	}

	static CreateInstance(settings) {
		const instance = new Main();
		instance.initialize(settings);
		return instance;
	}
}