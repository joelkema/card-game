import { expect, test } from "vitest";

import { Observable } from "./Observable";

test("can subscribe to an Observable", () => {
	const observable = Observable.create((subscriber) => {
		subscriber.next("Hello world!");
	});

	observable.subscribe((message) => {
		expect(message).toBe("Hello world!");
	});
});

test("can subscribe to an Observable with an error", () => {
	const observable = Observable.create((subscriber) => {
		subscriber.error(new Error("Something went wrong"));
	});

	observable.subscribe({
		error(err) {
			expect(err.message).toBe("Something went wrong");
		},
	});
});

test("can subscribe to an Observable with a completion", () => {
	const observable = Observable.create((subscriber) => {
		subscriber.complete();
	});

	observable.subscribe({
		complete() {
			expect(true).toBe(true);
		},
	});
});

test("can subscribe to an Observable with a value and completion", () => {
	const observable = Observable.create((subscriber) => {
		subscriber.next("Hello world!");
		subscriber.complete();
	});

	observable.subscribe({
		next(value) {
			expect(value).toBe("Hello world!");
		},
		complete() {
			expect(true).toBe(true);
		},
	});
});

test("can have multiple subscribers", () => {
	const observable = Observable.create((observer) => {
		observer.next("I am number 1");
		observer.next("I am number 2");
		observer.error("I am number 3");
		observer.complete();
		observer.next("I am number 5");
	});

	observable.subscribe((message) => {
		expect(message).toBe("I am number 1");
	});
});

test("should have the correct order of execution", () => {
	const observable = new Observable((subscriber) => {
		subscriber.next(1);
		subscriber.next(2);
		subscriber.next(3);
		setTimeout(() => {
			subscriber.next(4);
			subscriber.complete();
		}, 1000);
	});

	const logMessages: string[] = [];

	const log = (message: string) => logMessages.push(message);

	log("just before subscribe");
	observable.subscribe({
		next(x) {
			log("got value " + x);
		},
		error(err) {
			log("something wrong occurred: " + err);
		},
		complete() {
			log("done");
		},
	});
	log("just after subscribe");

	// verify the order of the logs
	// and wait for the async operation to complete
	setTimeout(() => {
		expect(logMessages).toEqual([
			"just before subscribe",
			"got value 1",
			"got value 2",
			"got value 3",
			"just after subscribe",
			"got value 4",
			"done",
		]);
	}, 1100);
});
