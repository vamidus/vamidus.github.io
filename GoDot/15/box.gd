extends Node2D

# config
var animationDuration: float = .2
var difficulty: int = 10
var gridHeight: int = 4
var gridWidth: int = 4
var offsetX: int = -79
var offsetY: int = -79
var tileHeight: int = 288
var tileWidth: int = 288

# variables
var grid = []

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	initialize()

func initialize() -> void:
	setupGrid()
	drawGrid()
	scrambleGrid()

func setupGrid() -> void:
	grid.clear()
	grid.resize(gridHeight * gridWidth)
	for i in range(grid.size() - 1):
		grid[i] = i + 1

func drawGrid() -> void:
	get_tree().call_group("Tiles", "queue_free")
	await get_tree().create_timer(animationDuration).timeout
	for i in range(grid.size()):
		if grid[i] == null:
			continue
		var column: int = i % gridWidth
		var row: int = floor(i / gridHeight)
		var texture = load("res://" + str(grid[i]) + ".png")
		var newTile = Sprite2D.new()
		newTile.name = "Tile" + str(grid[i])
		newTile.set_meta("index", grid[i])
		newTile.position = Vector2(tileWidth * (column + 1) + offsetX, tileHeight * (row + 1) + offsetY)
		newTile.texture = texture
		newTile.add_to_group("Tiles")
		add_child(newTile)

func scrambleGrid() -> void:
	var previousTiles = []
	for c in range(difficulty):
		var i = grid.find(null)
		var column: int = i % gridWidth
		var row: int = floor(i / gridHeight)
		var possibilities = []
		if column > 0:
			possibilities.append(row * gridWidth + column - 1)
		if column < gridWidth - 1:
			possibilities.append(row * gridWidth + column + 1)
		if row > 0:
			possibilities.append((row - 1) * gridWidth + column)
		if row < gridHeight - 1:
			possibilities.append((row + 1) * gridWidth + column)
		if previousTiles.size() == 2:
			possibilities.erase(previousTiles[0])
			previousTiles.remove_at(0)
		var targetIndex = randi_range(0, possibilities.size() - 1)
		previousTiles.append(possibilities[targetIndex])
		performMoveTile(possibilities[targetIndex], i, animationDuration / 2)
		grid[i] = grid[possibilities[targetIndex]]
		grid[possibilities[targetIndex]] = null
		await get_tree().create_timer(animationDuration / 3).timeout

func moveTile(startingIndex: int) -> void:
	var destinationIndex = grid.find(null)
	var distance = abs(startingIndex - destinationIndex)
	if [gridWidth, 1].find(distance) > -1:
		performMoveTile(startingIndex, destinationIndex, animationDuration)
		grid[destinationIndex] = grid[startingIndex]
		grid[startingIndex] = null

func performMoveTile(startingIndex: int, destinationIndex: int, duration: float) -> void:
	var tile: Node = get_node_or_null("Tile" + str(grid[startingIndex]))
	if tile == null:
		return
	var tween: Tween = create_tween()
	var startingColumn: int = startingIndex % gridWidth
	var startingRow: int = floor(startingIndex / gridHeight)
	var vectorFrom: Vector2 = Vector2(tileWidth * (startingColumn + 1) + offsetX, tileHeight * (startingRow + 1) + offsetY)
	var destinationColumn: int = destinationIndex % gridWidth
	var destinationRow: int = floor(destinationIndex / gridHeight)
	var vectorTo: Vector2 = Vector2(tileWidth * (destinationColumn + 1) + offsetX, tileHeight * (destinationRow + 1) + offsetY)
	tween.tween_property(tile, "position", vectorTo, duration).from(vectorFrom)

func solved() -> bool:
	return grid[grid.size() - 1] == null && range(1, grid.size() - 1).all(func(i): return grid[i] == grid[i-1] + 1)

func _input(event):
	if event is InputEventMouseButton and event.pressed:
		for sprite in get_tree().get_nodes_in_group("Tiles"):
			var local_pos = sprite.to_local(event.position)
			if sprite.get_rect().has_point(local_pos):
				var index = grid.find(sprite.get_meta("index"))
				moveTile(index)
				if solved():
					await get_tree().create_timer(animationDuration).timeout
					OS.alert("Congrats!")
					initialize()	
				break # Only handle the first one found

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass
