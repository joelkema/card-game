import { Observable } from "./Observable";

/**
 * A function type interface that describes a function that accepts one parameter `T`
 * and returns another parameter `R`.
 *
 * Usually used to describe {@link OperatorFunction} - it always takes a single
 * parameter (the source Observable) and returns another Observable.
 */
export interface UnaryFunction<T, R> {
	(source: T): R;
}

export interface OperatorFunction<T, R>
	extends UnaryFunction<Observable<T>, Observable<R>> {}

export interface Observer<T> {
	next: (value: T) => void;
	error: (err: any) => void;
	complete: () => void;
}

export interface Unsubscribable {
	unsubscribe(): void;
}

export interface Subscribable<T> {
	subscribe(observer: Partial<Observer<T>>): Unsubscribable;
}
