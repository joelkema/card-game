import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameState, Enemy } from "../types/GameState";

const initialGameState: GameState = {
	turnTimer: 10,
	enemies: [],
};

// Redux slice to manage game state
export const gameSlice = createSlice({
	name: "game",
	initialState: initialGameState,
	reducers: {
		decrementTimer(state) {
			if (state.turnTimer > 0) {
				state.turnTimer -= 1;
			} else {
				state.turnTimer = 10; // Reset timer after it reaches 0
			}
		},
		spawnEnemies(state, action: PayloadAction<{ positions: Enemy[] }>) {
			state.enemies = [...action.payload.positions];
		},
		updateEnemyPositions(state) {
			state.enemies = state.enemies.map((enemy) => {
				const dx = enemy.targetX - enemy.x;
				const dy = enemy.targetY - enemy.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < enemy.speed) {
					// Snap to the target if close enough
					return { ...enemy, x: enemy.targetX, y: enemy.targetY };
				} else {
					// Move towards the target
					return {
						...enemy,
						x: enemy.x + (dx / distance) * enemy.speed,
						y: enemy.y + (dy / distance) * enemy.speed,
					};
				}
			});
		},
	},
});

// Configure the Redux store
export const store = configureStore({
	reducer: gameSlice.reducer,
});
