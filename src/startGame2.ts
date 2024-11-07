// import { Enemy } from "./actors/Enemy";
// import { MessageQueue } from "./actors/MessageQueue";
// import { Player } from "./actors/Player";
//
// const actors = {
// 	player: new Player("player", 50, 50),
// 	enemy: new Enemy("enemy", 100, 100),
// };
//
// const messageQueue = new MessageQueue();
//
// const gameLoop =
// 	(ctx: CanvasRenderingContext2D, previousTime: number): FrameRequestCallback =>
// 		(timeInMs) => {
// 			const canvas = ctx.canvas;
//
// 			// Clear canvas
// 			ctx.clearRect(0, 0, canvas.width, canvas.height);
//
// 			// Update actors and handle messages
// 			messageQueue.dispatch(actors);
// 			for (let actor of Object.values(actors)) {
// 				actor.update();
// 				actor.draw(ctx);
// 			}
//
// 			// Request the next animation frame
// 			requestAnimationFrame(gameLoop(ctx, timeInMs));
// 		};
// // Setup canvas and button
// const decrementButton = document.getElementById(
// 	"decrementButton",
// ) as HTMLButtonElement;
//
// // Button to manually decrement the timer
// decrementButton.addEventListener("click", () => {
// 	messageQueue.sendMessage("player", {
// 		type: "MOVE",
// 		payload: { dx: 40, dy: 0 },
// 	});
//
// 	// if (turnTimer === 0) {
// 	// eventBus.emit("timerExpired", undefined);
// 	// }
// });
// export const startGame = (ctx: CanvasRenderingContext2D) => {
// 	// Start the first frame request
// 	requestAnimationFrame(gameLoop(ctx, 0));
// };
