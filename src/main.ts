import { startGame } from "./startGame2";
import "./style.css";
import { from, of, Observable } from "./observers/Observable";
import { FrameData } from "./types/FrameData";
import expand from "./observers/operators/expand";
import map from "./observers/operators/map";

// Usage example
const fruits = ["orange", "apple", "banana"];

of(fruits).subscribe(console.log); // ['orange','apple','banana']
from(fruits).subscribe(console.log); // 'orange','apple','banana'

const state$ = of({
	score: 1,
	lives: 3,
	level: 1,
	duration: 1,
	interval: 200,
});

// Streams: a sequence of values over time. In stead of variables we are working with streams. No one can hear you stream unless you subscribe to it.
// Observables: observable is NOT a stream. It is a blueprint for a stream. It describes a set of streams, also how they are connected with operations.
// Observers: An observer id an object that receives notifications from an observable. It is an object with three methods: next, error, complete.

/**
 * This function returns an observable that will emit the next frame once the
 * browser has returned an animation frame step. Given the previous frame it calculates
 * the delta time, and we also clamp it to 30FPS in case we get long frames.
 */
const calculateStep: (
	prevFrame: FrameData | undefined,
) => Observable<FrameData | undefined> = (prevFrame) => {
	return Observable.create((observer) => {
		requestAnimationFrame((frameStartTime) => {
			// Millis to seconds
			const deltaTime = prevFrame
				? (frameStartTime - prevFrame.frameStartTime) / 1000
				: 0;

			// calculate fps
			const fps = 1 / deltaTime;

			console.log("FPS", fps);

			observer.next({
				frameStartTime,
				deltaTime,
			});
		});
	});
};

// This is our core stream of frames. We use expand to recursively call the
//  `calculateStep` function above that will give us each new Frame based on the
//  window.requestAnimationFrame calls. Expand emits the value of the called functions
//  returned observable, as well as recursively calling the function with that same
//  emitted value. This works perfectly for calculating our frame steps because each step
//  needs to know the lastStepFrameTime to calculate the next. We also only want to request
//  a new frame once the currently requested frame has returned.
const frames$ = of(undefined).pipe(
	// expand((val) => calculateStep(val)),
	// Expand emits the first value provided to it, and in this
	//  case we just want to ignore the undefined input frame
	// filter(frame => frame !== undefined),
	// map((frame: IFrameData) => frame.deltaTime),
	// share()
	expand((val) => calculateStep(val as any)),
);

frames$.subscribe();

const canvas = document.getElementById("game")! as HTMLCanvasElement;

// startGame(canvas.getContext("2d")!); cc
