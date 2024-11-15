import { OperatorFunction } from "../types";
import { Observable } from "../Observable";

/**
 * Emits only the first value emitted by the source Observable.
 *
 * @returns An Observable that emits only the first item emitted by the source Observable, or an Error if no items are emitted.
 * @param source The source Observable to emit the first value from.
 */
const first =
	<T>(): OperatorFunction<T, T> =>
	(source) =>
		new Observable<T>((subscriber) => {
			const subscription = source.subscribe({
				next(value) {
					subscriber.next(value);
					subscriber.complete();
					subscription.unsubscribe();
				},
				error(err) {
					subscriber.error(err);
				},
				complete() {
					subscriber.complete();
				},
			});
		});

export default first;
