import {
	Observer,
	OperatorFunction,
	Subscribable,
	UnaryFunction,
} from "./types";

class ConsumerObserver<T> implements Observer<T> {
	constructor(private partialObserver: Partial<Observer<T>>) {}

	next(value: T): void {
		const { partialObserver } = this;
		if (partialObserver.next) {
			try {
				partialObserver.next(value);
			} catch (error) {}
		}
	}

	error(err: any): void {
		const { partialObserver } = this;
		if (partialObserver.error) {
			try {
				partialObserver.error(err);
			} catch (error) {}
		} else {
		}
	}

	complete(): void {
		const { partialObserver } = this;
		if (partialObserver.complete) {
			try {
				partialObserver.complete();
			} catch (error) {}
		}
	}
}

export function isFunction(value: any): value is (...args: any[]) => any {
	return typeof value === "function";
}

function createSafeObserver<T>(
	observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
): Observer<T> {
	return new ConsumerObserver(
		!observerOrNext || isFunction(observerOrNext)
			? { next: observerOrNext ?? undefined }
			: observerOrNext,
	);
}

// Observable.ts (updated with create and of methods)
export class Observable<T> implements Subscribable<T> {
	private _subscribe: (subscriber: Subscriber<T>) => void;

	constructor(subscribe: (subscriber: Subscriber<T>) => void) {
		this._subscribe = subscribe;
	}

	static create<T>(
		subscribe: (subscriber: Subscriber<T>) => void,
	): Observable<T> {
		return new Observable(subscribe);
	}

	static of<T>(...values: T[]): Observable<T> {
		return new Observable((subscriber) => {
			values.forEach((value) => subscriber.next(value));
			subscriber.complete();
		});
	}

	subscribe(
		observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
	): Subscription {
		const subscriber =
			observerOrNext instanceof Subscriber
				? observerOrNext
				: new Subscriber(observerOrNext);
		this._subscribe(subscriber);
		return subscriber;
	}

	pipe(): Observable<T>;
	pipe<A>(op1: UnaryFunction<Observable<T>, A>): A;
	pipe<A, B>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>): B;
	pipe<A, B, C>(
		op1: UnaryFunction<Observable<T>, A>,
		op2: UnaryFunction<A, B>,
		op3: UnaryFunction<B, C>,
	): C;
	pipe<A, B, C, D>(
		op1: UnaryFunction<Observable<T>, A>,
		op2: UnaryFunction<A, B>,
		op3: UnaryFunction<B, C>,
		op4: UnaryFunction<C, D>,
	): D;
	pipe<A, B, C, D, E>(
		op1: UnaryFunction<Observable<T>, A>,
		op2: UnaryFunction<A, B>,
		op3: UnaryFunction<B, C>,
		op4: UnaryFunction<C, D>,
		op5: UnaryFunction<D, E>,
	): E;
	pipe<A, B, C, D, E, F>(
		op1: UnaryFunction<Observable<T>, A>,
		op2: UnaryFunction<A, B>,
		op3: UnaryFunction<B, C>,
		op4: UnaryFunction<C, D>,
		op5: UnaryFunction<D, E>,
		op6: UnaryFunction<E, F>,
	): F;
	pipe<A, B, C, D, E, F, G>(
		op1: UnaryFunction<Observable<T>, A>,
		op2: UnaryFunction<A, B>,
		op3: UnaryFunction<B, C>,
		op4: UnaryFunction<C, D>,
		op5: UnaryFunction<D, E>,
		op6: UnaryFunction<E, F>,
		op7: UnaryFunction<F, G>,
	): G;
	pipe<A, B, C, D, E, F, G, H>(
		op1: UnaryFunction<Observable<T>, A>,
		op2: UnaryFunction<A, B>,
		op3: UnaryFunction<B, C>,
		op4: UnaryFunction<C, D>,
		op5: UnaryFunction<D, E>,
		op6: UnaryFunction<E, F>,
		op7: UnaryFunction<F, G>,
		op8: UnaryFunction<G, H>,
	): H;
	pipe<A, B, C, D, E, F, G, H, I>(
		op1: UnaryFunction<Observable<T>, A>,
		op2: UnaryFunction<A, B>,
		op3: UnaryFunction<B, C>,
		op4: UnaryFunction<C, D>,
		op5: UnaryFunction<D, E>,
		op6: UnaryFunction<E, F>,
		op7: UnaryFunction<F, G>,
		op8: UnaryFunction<G, H>,
		op9: UnaryFunction<H, I>,
	): I;
	pipe<A, B, C, D, E, F, G, H, I>(
		op1: UnaryFunction<Observable<T>, A>,
		op2: UnaryFunction<A, B>,
		op3: UnaryFunction<B, C>,
		op4: UnaryFunction<C, D>,
		op5: UnaryFunction<D, E>,
		op6: UnaryFunction<E, F>,
		op7: UnaryFunction<F, G>,
		op8: UnaryFunction<G, H>,
		op9: UnaryFunction<H, I>,
		...operations: OperatorFunction<any, any>[]
	): Observable<unknown>;
	pipe<A, B, C, D, E, F, G, H, I>(
		op1: UnaryFunction<Observable<T>, A>,
		op2: UnaryFunction<A, B>,
		op3: UnaryFunction<B, C>,
		op4: UnaryFunction<C, D>,
		op5: UnaryFunction<D, E>,
		op6: UnaryFunction<E, F>,
		op7: UnaryFunction<F, G>,
		op8: UnaryFunction<G, H>,
		op9: UnaryFunction<H, I>,
		...operations: UnaryFunction<any, any>[]
	): unknown;

	/**
	 * Used to stitch together functional operators into a chain.
	 *
	 * ## Example
	 *
	 * ```ts
	 * import { interval, filter, map, scan } from 'rxjs';
	 *
	 * interval(1000)
	 *   .pipe(
	 *     filter(x => x % 2 === 0),
	 *     map(x => x + x),
	 *     scan((acc, x) => acc + x)
	 *   )
	 *   .subscribe(x => console.log(x));
	 * ```
	 *
	 * @return The Observable result of all the operators having been called
	 * in the order they were passed in.
	 */
	pipe(...operations: UnaryFunction<any, any>[]): unknown {
		return operations.reduce(pipeReducer, this as any);
	}
}

function pipeReducer(prev: any, fn: UnaryFunction<any, any>) {
	return fn(prev);
}

// Subscription.ts
class Subscription {
	/**
	 * A flag to indicate whether this Subscription has already been unsubscribed.
	 */
	public closed = false;

	unsubscribe(): void {
		this.closed = true;
	}
}

// Subscriber.ts
class Subscriber<T> extends Subscription implements Observer<T> {
	/** @internal */
	protected destination: Observer<T>;

	constructor(
		destination:
			| Subscriber<T>
			| Partial<Observer<T>>
			| ((value: T) => void)
			| null,
	) {
		super();

		// The only way we know that error reporting safety has been applied is if we own it.
		this.destination =
			destination instanceof Subscriber
				? destination
				: createSafeObserver(destination);
	}

	next(value: T): void {
		if (!this.closed && this.destination.next) {
			this.destination.next(value);
		}
	}

	error(err: any): void {
		if (!this.closed && this.destination.error) {
			this.closed = true;
			this.destination.error(err);
		}
	}

	complete(): void {
		if (!this.closed && this.destination.complete) {
			this.closed = true;
			this.destination.complete();
		}
	}
}

/**
 * Creates an Observable that emits the values at once.
 *
 * @param values the values to emit.
 * @return an observable that emits the provided values.
 * @example
 * ```ts
 * import { of } from "./observable";`
 *
 * const fruits = ["orange", "apple", "banana"];
 *
 * of(fruits).subscribe(console.log); // ['orange','apple','banana']
 */
export function of<T>(...values: Array<T>): Observable<T> {
	return new Observable<T>((subscriber: Subscriber<T>) => {
		for (let i = 0; i < values.length; i++) {
			subscriber.next(values[i]);
		}
		subscriber.complete();
	});
}

/**
 * Creates an Observable that emits the values one by one.
 *
 * @param values the values to emit.
 * @return an observable that emits the provided values.
 * @example
 * ```ts
 * import { from } from "./observable";`
 *
 * const fruits = ["orange", "apple", "banana"];
 *
 * from(fruits).subscribe(console.log); // 'orange','apple','banana'
 */
export function from<T>(input: Array<T>): Observable<T> {
	return new Observable<T>((subscriber) => {
		for (const item of input) {
			subscriber.next(item);
		}
		subscriber.complete();
	});
}
//
// // Operators.ts (updated with expand and share)
// function expand<T>(
// 	project: (value: T) => Observable<T>,
// ): OperatorFunction<T, T> {
// 	return (source: Observable<T>) =>
// 		new Observable<T>((subscriber) => {
// 			const subscribeNext = (value: T) => {
// 				project(value).subscribe({
// 					next: (val) => {
// 						subscriber.next(val);
// 						subscribeNext(val);
// 					},
// 					error: (err) => subscriber.error(err),
// 					complete: () => subscriber.complete(),
// 				});
// 			};
//
// 			source.subscribe({
// 				next: (val) => {
// 					subscriber.next(val);
// 					subscribeNext(val);
// 				},
// 				error: (err) => subscriber.error(err),
// 				complete: () => subscriber.complete(),
// 			});
// 		});
// }
//
// function share<T>(): OperatorFunction<T, T> {
// 	let subscribers: Subscriber<T>[] = [];
// 	let sourceSubscription: Subscription | null = null;
//
// 	return (source: Observable<T>) =>
// 		new Observable<T>((subscriber) => {
// 			subscribers.push(subscriber);
//
// 			if (!sourceSubscription) {
// 				sourceSubscription = source.subscribe({
// 					next: (value) => subscribers.forEach((sub) => sub.next(value)),
// 					error: (err) => subscribers.forEach((sub) => sub.error(err)),
// 					complete: () => subscribers.forEach((sub) => sub.complete()),
// 				});
// 			}
//
// 			return new Subscription(() => {
// 				subscribers = subscribers.filter((sub) => sub !== subscriber);
// 				if (subscribers.length === 0 && sourceSubscription) {
// 					sourceSubscription.unsubscribe();
// 					sourceSubscription = null;
// 				}
// 			});
// 		});
// }
