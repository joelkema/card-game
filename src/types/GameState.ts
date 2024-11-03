export type Enemy = {
	x: number;
	y: number;
	targetX: number;
	targetY: number;
	speed: number;
};

export type GameState = {
	turnTimer: number;
	enemies: Enemy[];
};

export type GameStateSlice = GameState & {
	decrementTimer: () => void;
	// spawnEnemies: (positions: { x: number; y: number }[]) => void;
	updateEnemyPositions: () => void;
};
