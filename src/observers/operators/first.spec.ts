import { expect, test } from "vitest";

import first from "./first";
import { of } from "../Observable";

test("should emit first value", () => {
	const values = [1, 2, 3];

	const observable = of(...values).pipe(first());

	observable.subscribe((value) => {
		expect(value).toBe(1);
	});
});

test("should complete after first value", () => {
	const values = [1, 2, 3];

	const observable = of(...values).pipe(first());

	let completed = false;

	observable.subscribe({
		complete() {
			completed = true;
		},
	});

	expect(completed).toBe(true);
});
