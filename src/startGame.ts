import { gameSlice, store } from "./stores/gameStore";

const { decrementTimer, spawnEnemies, updateEnemyPositions } =
	gameSlice.actions;

type GameEventMap = {
	timerExpired: void;
	spawnEnemies: { positions: { x: number; y: number }[] };
};

class EventBus<T extends Record<string, any>> {
	private events: { [K in keyof T]?: Array<(data: T[K]) => void> } = {};

	on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event]!.push(listener);
	}

	emit<K extends keyof T>(event: K, data: T[K]): void {
		if (this.events[event]) {
			this.events[event]!.forEach((listener) => listener(data));
		}
	}
}

const eventBus = new EventBus<GameEventMap>();

// SpawnEnemies listener to add enemies to the game state immutably
eventBus.on("timerExpired", () => {
	const newEnemies = [
		{
			x: 0,
			y: 0,
			targetX: Math.random() * 400,
			targetY: Math.random() * 200,
			speed: 2,
		},
		{
			x: 0,
			y: 0,
			targetX: Math.random() * 400,
			targetY: Math.random() * 200,
			speed: 2,
		},
	];

	store.dispatch(decrementTimer());
	// Dispatch the spawnEnemies action when the timer expires
	store.dispatch(spawnEnemies({ positions: newEnemies }));
});

// Render function: draws enemies at their current positions
function render(ctx: CanvasRenderingContext2D) {
	// Clear the canvas
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	// Get the current state
	const { turnTimer, enemies } = store.getState();

	// Draw each enemy
	enemies.forEach((enemy) => {
		ctx.fillStyle = "red";
		ctx.fillRect(enemy.x, enemy.y, 20, 20); // Draw each enemy as a block
	});

	// Display the turn timer
	ctx.fillStyle = "black";
	ctx.font = "16px Arial";
	ctx.fillText(`Turn Timer: ${turnTimer}`, 10, 20);
}

// Game loop function
const gameLoop =
	(ctx: CanvasRenderingContext2D, previousTime: number): FrameRequestCallback =>
	(timeInMs) => {
		const state = store.getState();

		// Compute the delta-time against the previous time
		const deltaTime = timeInMs - previousTime;
		const secondsPassed = Math.floor(timeInMs / 1000);

		// Decrement the timer and update enemy positions
		store.dispatch(updateEnemyPositions());

		// Check if the timer reached 0 and emit `timerExpired`
		if (state.turnTimer === 0) {
			console.log("timer expired");
			eventBus.emit("timerExpired", undefined);
		}

		// Render the current state
		render(ctx);

		// Continue the loop
		requestAnimationFrame(gameLoop(ctx, timeInMs));
	};

// Setup canvas and button
const decrementButton = document.getElementById(
	"decrementButton",
) as HTMLButtonElement;

// Button to manually decrement the timer
decrementButton.addEventListener("click", () => {
	store.dispatch(decrementTimer());
	// if (turnTimer === 0) {
	// eventBus.emit("timerExpired", undefined);
	// }
});

export const startGame = (ctx: CanvasRenderingContext2D) => {
	// Start the first frame request
	requestAnimationFrame(gameLoop(ctx, 0));
};
