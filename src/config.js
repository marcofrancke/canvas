var BATTLEFIELD_WIDTH = 1500,
	BATTLEFIELD_HEIGHT = 900,

	VEHICLE_FACTORY_PRICE = 1200,
	VEHICLE_FACTORY_ENERGY_USE = 400,
	VEHICLE_FACTORY_PROTECTION = 800,
	VEHICLE_FACTORY_WIDTH = 2,
	VEHICLE_FACTORY_HEIGHT = 2,

	VEHICLE_WIDTH = 1,
	VEHICLE_HEIGHT = 1,

	// UNITS
	SCOUT_PROTECTION = 100,
	SCOUT_SHIELD = 100,
	SCOUT_PRICE = 300,
	SCOUT_SPEED = 78,
	SCOUT_FIREPOWER = 2,
	SCOUT_FIRERANGE = 350,
	SCOUT_FIRESPEED = 700,
	SCOUT_WIDTH = 50,
	SCOUT_HEIGHT = 50,

	TANK_PROTECTION = 100,
	TANK_SHIELD = 100,
	TANK_PRICE = 600,
	TANK_SPEED = 100,
	TANK_FIREPOWER = 10,
	TANK_FIRERANGE = 600,
	TANK_FIRESPEED = 512,
	TANK_WIDTH = 50,
	TANK_HEIGHT = 50,

	GRID_SIZE = 50,

	OBSTACLES = [
		{x: 0, y: 0},
		{x: 1, y: 0},
		{x: 2, y: 0},
		{x: 3, y: 0},
		{x: 4, y: 0},
		{x: 7, y: 0},
		{x: 8, y: 0},
		{x: 9, y: 0},
		{x: 10, y: 0},
		{x: 12, y: 0},
		{x: 13, y: 0},
		{x: 16, y: 0},
		{x: 17, y: 0},
		{x: 18, y: 0},
		{x: 19, y: 0},
		{x: 20, y: 0},
		{x: 21, y: 0},
		{x: 22, y: 0},
		{x: 23, y: 0},
		{x: 24, y: 0},
		{x: 25, y: 0},
		{x: 26, y: 0},
		{x: 27, y: 0},
		{x: 28, y: 0},
		{x: 29, y: 0},
		{x: 30, y: 0},
		{x: 31, y: 0},
		{x: 32, y: 0},

		{x: 0, y: 1},
		{x: 1, y: 1},
		{x: 7, y: 1},
		{x: 8, y: 1},
		{x: 9, y: 1},
		{x: 10, y: 1},
		{x: 20, y: 1},
		{x: 21, y: 1},
		{x: 22, y: 1},
		{x: 23, y: 1},
		{x: 24, y: 1},
		{x: 25, y: 1},
		{x: 26, y: 1},
		{x: 27, y: 1},
		{x: 28, y: 1},
		{x: 29, y: 1},
		{x: 30, y: 1},
		{x: 31, y: 1},

		{x: 0, y: 2},
		{x: 1, y: 2},
		{x: 8, y: 2},
		{x: 9, y: 2},
		{x: 10, y: 2},
		{x: 20, y: 2},
		{x: 21, y: 2},
		{x: 22, y: 2},
		{x: 23, y: 2},
		{x: 24, y: 2},
		{x: 25, y: 2},
		{x: 26, y: 2},
		{x: 27, y: 2},
		{x: 28, y: 2},
		{x: 29, y: 2},
		{x: 30, y: 2},
		{x: 31, y: 2},

		{x: 0, y: 3},
		{x: 1, y: 3},
		{x: 21, y: 3},
		{x: 22, y: 3},
		{x: 23, y: 3},
		{x: 24, y: 3},
		{x: 25, y: 3},
		{x: 26, y: 3},
		{x: 27, y: 3},
		{x: 28, y: 3},
		{x: 29, y: 3},
		{x: 30, y: 3},

		{x: 21, y: 4},
		{x: 22, y: 4},
		{x: 23, y: 4},
		{x: 24, y: 4},
		{x: 25, y: 4},
		{x: 26, y: 4},
		{x: 27, y: 4},
		{x: 28, y: 4},
		{x: 29, y: 4},
		{x: 30, y: 4},

		{x: 21, y: 5},
		{x: 22, y: 5},
		{x: 23, y: 5},
		{x: 24, y: 5},
		{x: 25, y: 5},
		{x: 26, y: 5},
		{x: 27, y: 5},
		{x: 28, y: 5},
		{x: 29, y: 5},
		{x: 30, y: 5},

		{x: 7, y: 6},
		{x: 8, y: 6},
		{x: 9, y: 6},
		{x: 17, y: 6},
		{x: 18, y: 6},
		{x: 19, y: 6},
		{x: 21, y: 6},
		{x: 22, y: 6},
		{x: 23, y: 6},
		{x: 24, y: 6},
		{x: 25, y: 6},
		{x: 26, y: 6},
		{x: 27, y: 6},
		{x: 28, y: 6},
		{x: 29, y: 6},
		{x: 30, y: 6},

		{x: 0, y: 7},
		{x: 5, y: 7},
		{x: 6, y: 7},
		{x: 7, y: 7},
		{x: 8, y: 7},
		{x: 11, y: 7},
		{x: 17, y: 7},
		{x: 18, y: 7},
		{x: 22, y: 7},
		{x: 23, y: 7},
		{x: 24, y: 7},
		{x: 25, y: 7},
		{x: 26, y: 7},

		{x: 0, y: 8},
		{x: 4, y: 8},
		{x: 5, y: 8},
		{x: 6, y: 8},
		{x: 7, y: 8},
		{x: 8, y: 8},
		{x: 11, y: 8},
		{x: 12, y: 8},
		{x: 13, y: 8},

		{x: 0, y: 9},
		{x: 3, y: 9},
		{x: 4, y: 9},
		{x: 5, y: 9},
		{x: 6, y: 9},
		{x: 7, y: 9},
		{x: 13, y: 9},

		{x: 0, y: 10},
		{x: 1, y: 10},
		{x: 6, y: 10},

		{x: 0, y: 11},
		{x: 1, y: 11},
		{x: 6, y: 11},

		{x: 0, y: 12},
		{x: 1, y: 12},
		{x: 3, y: 12},
		{x: 4, y: 12},
		{x: 5, y: 12},
		{x: 6, y: 12},
		{x: 7, y: 12},
		{x: 13, y: 12},

		{x: 0, y: 13},
		{x: 4, y: 13},
		{x: 5, y: 13},
		{x: 6, y: 13},
		{x: 7, y: 13},
		{x: 8, y: 13},
		{x: 11, y: 13},
		{x: 12, y: 13},
		{x: 13, y: 13},

		{x: 0, y: 14},
		{x: 4, y: 14},
		{x: 5, y: 14},
		{x: 6, y: 14},
		{x: 7, y: 14},
		{x: 8, y: 14},
		{x: 11, y: 14},

		{x: 7, y: 15},
		{x: 8, y: 15},
		{x: 9, y: 15},
		{x: 10, y: 15},
		{x: 11, y: 15},


// TEST
		{x: 12, y: 3},
		{x: 13, y: 3},
		{x: 14, y: 3},
		{x: 12, y: 4},
		{x: 14, y: 4},
		{x: 12, y: 5},
		{x: 13, y: 5},
		{x: 14, y: 5},
	];