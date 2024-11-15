import { expect, test } from "vitest";
import fromEvent from "./fromEvent";

test("should emit event", () => {
	const button = document.createElement("button");

	const clicks = fromEvent(button, "click");

	clicks.subscribe((event) => {
		expect(event).toBeInstanceOf(MouseEvent);
	});
});

test("should remove event listener", () => {
	const button = document.createElement("button");

	const clicks = fromEvent(button, "click");
	let count = 0;

	const subscription = clicks.subscribe(() => {
		count++;
	});

	subscription.unsubscribe();

	button.dispatchEvent(new MouseEvent("click"));

	expect(count).toBe(0);
});

test("should update count", () => {
	const button = document.createElement("button");

	const clicks = fromEvent(button, "click");
	let count = 0;

	clicks.subscribe(() => {
		count++;
	});

	button.dispatchEvent(new MouseEvent("click"));

	expect(count).toBe(1);
});
