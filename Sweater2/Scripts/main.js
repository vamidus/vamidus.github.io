class Main {
	constructor() {
		// Selectors
		this.$tabButtons = null;
		this.$tabPanels = null;
		this.$imageCanvas = null;
		this.$pixelatedCanvas = null;
		this.$sweaterCanvas = null;
		this.$filePath = null;
		this.$fileInput = null;
		this.$browseBtn = null;
		this.$pixelWidth = null;
		this.$pixelHeight = null;
		this.$downloadBtn = null;
		this.$sweaterPixelWidth = null;
		this.$sweaterPixelHeight = null;
		this.$sweaterGap = null;
		this.$sweaterLineThickness = null;
		this.$sweaterOverlap = null;
		this.$sweaterNumColors = null;
		this.$sweaterDownloadBtn = null;
		
		// State
		this.currentImage = null;
		this.originalColorCount = 0;
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
		this.setupTabs();
		this.setupImageHandling();
		this.setupCanvas();
		this.setupPixelationControls();
		this.setupSweaterControls();
	}

	setupElementSelectors() {
		this.$tabButtons = $(".tab-button");
		this.$tabPanels = $(".tab-panel");
		this.$imageCanvas = $("#imageCanvas");
		this.$pixelatedCanvas = $("#pixelatedCanvas");
		this.$sweaterCanvas = $("#sweaterCanvas");
		this.$filePath = $("#filePath");
		this.$fileInput = $("#fileInput");
		this.$browseBtn = $("#browseBtn");
		this.$pixelWidth = $("#pixelWidth");
		this.$pixelHeight = $("#pixelHeight");
		this.$downloadBtn = $("#downloadBtn");
		this.$sweaterPixelWidth = $("#sweaterPixelWidth");
		this.$sweaterPixelHeight = $("#sweaterPixelHeight");
		this.$sweaterGap = $("#sweaterGap");
		this.$sweaterLineThickness = $("#sweaterLineThickness");
		this.$sweaterOverlap = $("#sweaterOverlap");
		this.$sweaterNumColors = $("#sweaterNumColors");
		this.$sweaterDownloadBtn = $("#sweaterDownloadBtn");
	}

	setupTabs() {
		this.$tabButtons.on("click", (e) => {
			const $clickedBtn = $(e.currentTarget);
			const tabIndex = this.$tabButtons.index($clickedBtn);
			this.switchTab(tabIndex);
		});

		// Keyboard navigation for tabs
		this.$tabButtons.on("keydown", (e) => {
			const $currentBtn = $(e.currentTarget);
			let newIndex = this.$tabButtons.index($currentBtn);

			switch (e.key) {
				case "ArrowLeft":
					newIndex = Math.max(0, newIndex - 1);
					e.preventDefault();
					break;
				case "ArrowRight":
					newIndex = Math.min(this.$tabButtons.length - 1, newIndex + 1);
					e.preventDefault();
					break;
				case "Home":
					newIndex = 0;
					e.preventDefault();
					break;
				case "End":
					newIndex = this.$tabButtons.length - 1;
					e.preventDefault();
					break;
				default:
					return;
			}

			this.switchTab(newIndex);
			this.$tabButtons.eq(newIndex).focus();
		});
	}

	switchTab(index) {
		// Update tab buttons
		this.$tabButtons.each((i, btn) => {
			const $btn = $(btn);
			if (i === index) {
				$btn.addClass("active").attr("aria-selected", "true").attr("tabindex", "0");
			} else {
				$btn.removeClass("active").attr("aria-selected", "false").attr("tabindex", "-1");
			}
		});

		// Update tab panels
		this.$tabPanels.each((i, panel) => {
			const $panel = $(panel);
			if (i === index) {
				$panel.addClass("active").removeAttr("hidden");
			} else {
				$panel.removeClass("active").attr("hidden", "");
			}
		});

		// Redraw pixelated image when switching to tab 2
		if (index === 1 && this.currentImage) {
			// Use setTimeout to ensure the tab is visible before drawing
			setTimeout(() => {
				this.drawPixelatedImage();
			}, 0);
		}

		// Redraw sweater pattern when switching to tab 3
		if (index === 2 && this.currentImage) {
			// Use setTimeout to ensure the tab is visible before drawing
			setTimeout(() => {
				this.drawSweaterPattern();
			}, 0);
		}
	}

	setupImageHandling() {
		// Browse button click handler
		this.$browseBtn.on("click", () => {
			this.$fileInput.click();
		});

		// File input change handler
		this.$fileInput.on("change", (e) => {
			const file = e.target.files[0];
			if (file) {
				this.$filePath.val(file.name);
				this.loadImageFromFile(file);
			}
		});

		// File path input change handler (for typed/pasted paths)
		this.$filePath.on("change", () => {
			const path = this.$filePath.val();
			if (path) {
				this.loadImageFromPath(path);
			}
		});
	}

	setupCanvas() {
		// Handle window resize
		$(window).on("resize", () => {
			if (this.currentImage) {
				this.drawImageOnCanvas();
				this.drawPixelatedImage();
				this.drawSweaterPattern();
			}
		});
	}

	setupPixelationControls() {
		// Pixel width input change handler
		this.$pixelWidth.on("input", () => {
			if (this.currentImage) {
				this.drawPixelatedImage();
			}
		});

		// Pixel height input change handler
		this.$pixelHeight.on("input", () => {
			if (this.currentImage) {
				this.drawPixelatedImage();
			}
		});

		// Download button click handler
		this.$downloadBtn.on("click", () => {
			this.downloadPixelatedImage();
		});
	}

	setupSweaterControls() {
		// Sweater pixel width input change handler
		this.$sweaterPixelWidth.on("input", () => {
			if (this.currentImage) {
				this.drawSweaterPattern();
			}
		});

		// Sweater pixel height input change handler
		this.$sweaterPixelHeight.on("input", () => {
			if (this.currentImage) {
				this.drawSweaterPattern();
			}
		});

		// Sweater gap input change handler
		this.$sweaterGap.on("input", () => {
			if (this.currentImage) {
				this.drawSweaterPattern();
			}
		});

		// Sweater line thickness input change handler
		this.$sweaterLineThickness.on("input", () => {
			if (this.currentImage) {
				this.drawSweaterPattern();
			}
		});

		// Sweater overlap input change handler
		this.$sweaterOverlap.on("input", () => {
			if (this.currentImage) {
				this.drawSweaterPattern();
			}
		});

		// Sweater number of colors input change handler
		this.$sweaterNumColors.on("input", () => {
			if (this.currentImage) {
				this.drawSweaterPattern();
			}
		});

		// Sweater download button click handler
		this.$sweaterDownloadBtn.on("click", () => {
			this.downloadSweaterPattern();
		});
	}

	loadImageFromFile(file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				this.currentImage = img;
				this.countOriginalColors();
				this.drawImageOnCanvas();
				this.drawPixelatedImage();
				this.drawSweaterPattern();
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}

	loadImageFromPath(path) {
		// For security reasons, browsers don't allow loading images from arbitrary file paths
		// This is a limitation of web security
		// We'll show a message to the user
		const ctx = this.$imageCanvas[0].getContext("2d");
		const canvas = this.$imageCanvas[0];
		
		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Draw message
		ctx.fillStyle = "#a0a0a0";
		ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("For security reasons, please use the Browse button", canvas.width / 2, canvas.height / 2 - 10);
		ctx.fillText("to select an image file.", canvas.width / 2, canvas.height / 2 + 10);
	}

	countOriginalColors() {
		if (!this.currentImage) return;

		// Create a small canvas to sample colors
		const sampleCanvas = document.createElement("canvas");
		const sampleSize = 100; // Sample at 100x100 for performance
		sampleCanvas.width = sampleSize;
		sampleCanvas.height = sampleSize;
		const sampleCtx = sampleCanvas.getContext("2d");
		
		// Draw image scaled down
		sampleCtx.drawImage(this.currentImage, 0, 0, sampleSize, sampleSize);
		
		// Get color data
		const imageData = sampleCtx.getImageData(0, 0, sampleSize, sampleSize);
		const colors = imageData.data;
		
		// Count unique colors
		const colorSet = new Set();
		for (let i = 0; i < colors.length; i += 4) {
			const r = colors[i];
			const g = colors[i + 1];
			const b = colors[i + 2];
			const a = colors[i + 3];
			
			if (a > 0) { // Only count non-transparent pixels
				const colorKey = `${r},${g},${b}`;
				colorSet.add(colorKey);
			}
		}
		
		this.originalColorCount = colorSet.size;
		
		// Set the input value to the original count
		this.$sweaterNumColors.val(this.originalColorCount);
	}

	quantizeColors(imageData, numColors) {
		if (!imageData || numColors <= 0) return imageData;

		const colors = imageData.data;
		
		// If numColors is 'auto' or greater than unique colors, return original
		if (numColors === 'auto' || numColors >= this.originalColorCount) {
			return imageData;
		}

		// Use k-means clustering for proper color quantization
		// Sample pixels to build initial centroids
		const pixels = [];
		for (let i = 0; i < colors.length; i += 4) {
			const a = colors[i + 3];
			if (a > 0) {
				pixels.push([colors[i], colors[i + 1], colors[i + 2]]);
			}
		}
		
		if (pixels.length === 0) return imageData;
		
		// Initialize centroids using k-means++ for better starting points
		const centroids = this.initializeCentroids(pixels, numColors);
		
		// Run k-means iterations
		const maxIterations = 10;
		for (let iter = 0; iter < maxIterations; iter++) {
			// Assign pixels to nearest centroid
			const clusters = Array(numColors).fill(null).map(() => []);
			
			for (const pixel of pixels) {
				let minDist = Infinity;
				let nearestCentroid = 0;
				
				for (let c = 0; c < centroids.length; c++) {
					const centroid = centroids[c];
					const dist = Math.sqrt(
						Math.pow(pixel[0] - centroid[0], 2) +
						Math.pow(pixel[1] - centroid[1], 2) +
						Math.pow(pixel[2] - centroid[2], 2)
					);
					if (dist < minDist) {
						minDist = dist;
						nearestCentroid = c;
					}
				}
				
				clusters[nearestCentroid].push(pixel);
			}
			
			// Recalculate centroids
			let converged = true;
			for (let c = 0; c < centroids.length; c++) {
				const cluster = clusters[c];
				if (cluster.length === 0) continue;
				
				const newR = Math.floor(cluster.reduce((sum, p) => sum + p[0], 0) / cluster.length);
				const newG = Math.floor(cluster.reduce((sum, p) => sum + p[1], 0) / cluster.length);
				const newB = Math.floor(cluster.reduce((sum, p) => sum + p[2], 0) / cluster.length);
				
				if (newR !== centroids[c][0] || newG !== centroids[c][1] || newB !== centroids[c][2]) {
					centroids[c] = [newR, newG, newB];
					converged = false;
				}
			}
			
			if (converged) break;
		}
		
		// Apply quantization to image data
		const quantizedData = new Uint8ClampedArray(colors.length);
		for (let i = 0; i < colors.length; i += 4) {
			const r = colors[i];
			const g = colors[i + 1];
			const b = colors[i + 2];
			const a = colors[i + 3];
			
			if (a === 0) {
				quantizedData[i] = r;
				quantizedData[i + 1] = g;
				quantizedData[i + 2] = b;
				quantizedData[i + 3] = a;
				continue;
			}
			
			// Find nearest centroid
			let minDist = Infinity;
			let nearestCentroid = centroids[0];
			
			for (const centroid of centroids) {
				const dist = Math.sqrt(
					Math.pow(r - centroid[0], 2) +
					Math.pow(g - centroid[1], 2) +
					Math.pow(b - centroid[2], 2)
				);
				if (dist < minDist) {
					minDist = dist;
					nearestCentroid = centroid;
				}
			}
			
			quantizedData[i] = nearestCentroid[0];
			quantizedData[i + 1] = nearestCentroid[1];
			quantizedData[i + 2] = nearestCentroid[2];
			quantizedData[i + 3] = a;
		}
		
		return new ImageData(quantizedData, imageData.width, imageData.height);
	}

	initializeCentroids(pixels, k) {
		const centroids = [];
		
		// Choose first centroid randomly
		const firstIndex = Math.floor(Math.random() * pixels.length);
		centroids.push([...pixels[firstIndex]]);
		
		// Choose remaining centroids using k-means++ algorithm
		for (let i = 1; i < k; i++) {
			const distances = [];
			let totalDist = 0;
			
			// Calculate distance to nearest existing centroid for each pixel
			for (const pixel of pixels) {
				let minDist = Infinity;
				for (const centroid of centroids) {
					const dist = Math.sqrt(
						Math.pow(pixel[0] - centroid[0], 2) +
						Math.pow(pixel[1] - centroid[1], 2) +
						Math.pow(pixel[2] - centroid[2], 2)
					);
					if (dist < minDist) {
						minDist = dist;
					}
				}
				distances.push(minDist * minDist); // Square the distance
				totalDist += distances[distances.length - 1];
			}
			
			// Choose next centroid with probability proportional to squared distance
			let random = Math.random() * totalDist;
			for (let j = 0; j < distances.length; j++) {
				random -= distances[j];
				if (random <= 0) {
					centroids.push([...pixels[j]]);
					break;
				}
			}
			
			// Fallback if we didn't select any (shouldn't happen with proper random)
			if (centroids.length === i) {
				centroids.push([...pixels[Math.floor(Math.random() * pixels.length)]]);
			}
		}
		
		return centroids;
	}

	drawImageOnCanvas() {
		if (!this.currentImage) return;

		const canvas = this.$imageCanvas[0];
		const ctx = canvas.getContext("2d");
		
		// Get container width
		const containerWidth = this.$imageCanvas.parent().width();
		const maxWidth = containerWidth - 48; // Account for padding
		
		// Calculate dimensions maintaining aspect ratio
		const aspectRatio = this.currentImage.width / this.currentImage.height;
		let newWidth = maxWidth;
		let newHeight = newWidth / aspectRatio;
		
		// Set canvas size
		canvas.width = newWidth;
		canvas.height = newHeight;
		
		// Draw image
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this.currentImage, 0, 0, newWidth, newHeight);
	}

	drawPixelatedImage() {
		if (!this.currentImage) return;

		const canvas = this.$pixelatedCanvas[0];
		const ctx = canvas.getContext("2d");
		
		// Get pixel dimensions from inputs
		const pixelWidth = parseInt(this.$pixelWidth.val()) || 10;
		const pixelHeight = parseInt(this.$pixelHeight.val()) || 10;
		
		// Get container width
		const containerWidth = this.$pixelatedCanvas.parent().width();
		const maxWidth = containerWidth - 48; // Account for padding
		
		// Ensure we have a valid width
		if (maxWidth <= 0) return;
		
		// Calculate dimensions maintaining aspect ratio
		const aspectRatio = this.currentImage.width / this.currentImage.height;
		let newWidth = maxWidth;
		let newHeight = newWidth / aspectRatio;
		
		// Set canvas size
		canvas.width = newWidth;
		canvas.height = newHeight;
		
		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Calculate scaled-down dimensions for pixelation
		const scaledWidth = Math.max(1, Math.ceil(newWidth / pixelWidth));
		const scaledHeight = Math.max(1, Math.ceil(newHeight / pixelHeight));
		
		// Create an offscreen canvas for pixelation
		const offscreenCanvas = document.createElement("canvas");
		offscreenCanvas.width = scaledWidth;
		offscreenCanvas.height = scaledHeight;
		const offscreenCtx = offscreenCanvas.getContext("2d");
		
		// Draw image scaled down
		offscreenCtx.drawImage(this.currentImage, 0, 0, scaledWidth, scaledHeight);
		
		// Disable image smoothing for pixelated effect
		ctx.imageSmoothingEnabled = false;
		
		// Draw scaled-up image back to main canvas
		ctx.drawImage(offscreenCanvas, 0, 0, scaledWidth, scaledHeight, 0, 0, newWidth, newHeight);
	}

	downloadPixelatedImage() {
		if (!this.currentImage) return;

		const canvas = this.$pixelatedCanvas[0];
		
		// Create a temporary link element
		const link = document.createElement("a");
		link.download = "pixelated-image.png";
		link.href = canvas.toDataURL("image/png");
		link.click();
	}

	drawSweaterPattern() {
		if (!this.currentImage) return;

		const canvas = this.$sweaterCanvas[0];
		const ctx = canvas.getContext("2d");
		
		// Get pixel dimensions from inputs
		const pixelWidth = parseInt(this.$sweaterPixelWidth.val()) || 10;
		const pixelHeight = parseInt(this.$sweaterPixelHeight.val()) || 10;
		
		// Get container width
		const containerWidth = this.$sweaterCanvas.parent().width();
		const maxWidth = containerWidth - 48; // Account for padding
		
		// Ensure we have a valid width
		if (maxWidth <= 0) return;
		
		// Calculate dimensions maintaining aspect ratio
		const aspectRatio = this.currentImage.width / this.currentImage.height;
		let newWidth = maxWidth;
		let newHeight = newWidth / aspectRatio;
		
		// Set canvas size
		canvas.width = newWidth;
		canvas.height = newHeight;
		
		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Calculate scaled-down dimensions for sampling
		const gap = parseFloat(this.$sweaterGap.val()) || 2;
		const lineThickness = parseFloat(this.$sweaterLineThickness.val()) || 2;
		const overlap = parseFloat(this.$sweaterOverlap.val()) || 0;
		const effectivePixelWidth = pixelWidth + gap;
		const effectivePixelHeight = pixelHeight + gap - overlap;
		
		const scaledWidth = Math.max(1, Math.ceil(newWidth / effectivePixelWidth));
		const scaledHeight = Math.max(1, Math.ceil(newHeight / effectivePixelHeight));
		
		// Create an offscreen canvas for sampling colors
		const offscreenCanvas = document.createElement("canvas");
		offscreenCanvas.width = scaledWidth;
		offscreenCanvas.height = scaledHeight;
		const offscreenCtx = offscreenCanvas.getContext("2d");
		
		// Draw image scaled down to get average colors
		offscreenCtx.drawImage(this.currentImage, 0, 0, scaledWidth, scaledHeight);
		
		// Get the color data from the scaled image
		let imageData = offscreenCtx.getImageData(0, 0, scaledWidth, scaledHeight);
		
		// Apply color quantization if specified
		const numColors = this.$sweaterNumColors.val();
		if (numColors !== 'auto' && parseInt(numColors) >= 2) {
			imageData = this.quantizeColors(imageData, parseInt(numColors));
		}
		
		const colors = imageData.data;
		
		// Draw V-shaped knitting pattern
		for (let y = 0; y < scaledHeight; y++) {
			for (let x = 0; x < scaledWidth; x++) {
				const colorIndex = (y * scaledWidth + x) * 4;
				const r = colors[colorIndex];
				const g = colors[colorIndex + 1];
				const b = colors[colorIndex + 2];
				const a = colors[colorIndex + 3];
				
				if (a === 0) continue; // Skip transparent pixels
				
				ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
				
				// Calculate position on the main canvas with gaps
				const posX = x * effectivePixelWidth;
				const posY = y * effectivePixelHeight;
				
				// Draw a single V-shaped knitting pattern (stockinette stitch)
				// Use stroke to create the V shape lines like real knitting
				ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
				ctx.lineWidth = lineThickness;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				
				ctx.beginPath();
				ctx.moveTo(posX, posY); // Top-left
				ctx.lineTo(posX + pixelWidth / 2, posY + pixelHeight); // Bottom-center
				ctx.lineTo(posX + pixelWidth, posY); // Top-right
				ctx.stroke();
			}
		}
	}

	downloadSweaterPattern() {
		if (!this.currentImage) return;

		const canvas = this.$sweaterCanvas[0];
		
		// Create a temporary link element
		const link = document.createElement("a");
		link.download = "sweater-pattern.png";
		link.href = canvas.toDataURL("image/png");
		link.click();
	}
	
	static CreateInstance(settings) {
		var instance = new Main();
		instance.initialize(settings);
	}
}