import { Observable } from "../Observable";
import { OperatorFunction } from "../types";

/**
 * Emits only those values from an Observable that pass a predicate
 * function.
 *
 * @param predicate A function that evaluates each value emitted by the source
 * Observable. If it returns `true`, the value is emitted, if `false` the value
 *
 * @returns An Observable that emits only those items from the source Observable
 * that pass the condition defined by the predicate.
 * */
const filter =
	<T>(predicate: (value: T) => boolean): OperatorFunction<T, T> =>
	(source) =>
		new Observable<T>((subscriber) =>
			source.subscribe({
				next(value) {
					if (predicate(value)) {
						subscriber.next(value);
					}
				},
				error(err) {
					subscriber.error(err);
				},
				complete() {
					subscriber.complete();
				},
			}),
		);

export default filter;
