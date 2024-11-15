import { Observable } from "../Observable";

/**
 * Combines multiple Observables to create an Observable whose values are arrays containing the
 * values of the input Observables.
 *
 * @param observables The Observables to combine.
 * @returns An Observable of arrays containing the values of the input Observables.
 * @example
 */
function combineLatest<T>(...observables: Observable<T>[]): Observable<T[]> {
	return new Observable<T[]>((subscriber) => {
		const values: T[] = new Array(observables.length);
		let completedCount = 0;
		let hasValue = new Array(observables.length).fill(false);

		observables.forEach((observable, index) => {
			observable.subscribe({
				next(value) {
					values[index] = value;
					hasValue[index] = true;
					if (hasValue.every(Boolean)) {
						subscriber.next([...values]);
					}
				},
				error(err) {
					subscriber.error(err);
				},
				complete() {
					completedCount++;
					if (completedCount === observables.length) {
						subscriber.complete();
					}
				},
			});
		});
	});
}

export default combineLatest;
