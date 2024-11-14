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

import { expand, filter, fromEvent, map, Observable, of, share } from "rxjs";
import { FrameData } from "./types/FrameData";
import { mapCodeToKey } from "./utils/mapKeyCodeToKey";

export const clampTo30FPS = (frame: FrameData | undefined) => {
	if (!frame) {
		return frame;
	}

	if (frame.deltaTime > 1 / 30) {
		frame.deltaTime = 1 / 30;
	}
	return frame;
};

const calculateStep: (
	prevFrame: FrameData | undefined,
) => Observable<FrameData> = (prevFrame: FrameData | undefined) =>
		new Observable((observer) => {
			requestAnimationFrame((frameStartTime) => {
				// Millis to seconds
				const deltaTime = prevFrame
					? (frameStartTime - prevFrame.frameStartTime) / 1000
					: 0;
				observer.next({
					frameStartTime,
					deltaTime,
				});
			});
		});

// This is our core stream of frames. We use expand to recursively call the
//  `calculateStep` function above that will give us each new Frame based on the
//  window.requestAnimationFrame calls. Expand emits the value of the called functions
//  returned observable, as well as recursively calling the function with that same
//  emitted value. This works perfectly for calculating our frame steps because each step
//  needs to know the lastStepFrameTime to calculate the next. We also only want to request
//  a new frame once the currently requested frame has returned.
const $frames = of(undefined).pipe(
	expand((val) => calculateStep(val)),
	// Expand emits the first value provided to it, and in this
	// case we just want to ignore the undefined input frame
	filter((frame) => frame !== undefined),
	map((frame: FrameData) => frame.deltaTime),
	share(),
);

// This is our core stream of keyDown input events. It emits an object like `{"spacebar": 32}`
//  each time a key is pressed down.
const keysDown$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
	map((event) => {
		const name = mapCodeToKey(event.key);
		if (name !== "") {
			let keyMap: Record<string, string> = {};
			keyMap[name] = event.code;
			return keyMap;
		} else {
			return undefined;
		}
	}),
	filter((keyMap) => keyMap !== undefined),
);

export const startGame = (ctx: CanvasRenderingContext2D) => {
	$frames.subscribe((frame) => {
		console.log(frame);
	});
};
