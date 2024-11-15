import { Observable, Subscription } from "../Observable";

/**
 * The `expand` function is designed to create a recursive loop.
 * It takes a projection function that returns an Observable,
 * and it recursively applies this function to each emitted value,
 * creating a potentially infinite sequence of emissions.
 */
function expand<T>(project: (value: T, index: number) => Observable<T>) {
	return (source: Observable<T>): Observable<T> => {
		return new Observable<T>((subscriber) => {
			let index = 0;
			const subscriptions = new Set<Subscription>();

			const subscribeToProjection = (value: T) => {
				const projectedObservable = project(value, index++);
				const innerSubscription = projectedObservable.subscribe({
					next(innerValue) {
						subscriber.next(innerValue);
						subscribeToProjection(innerValue);
					},
					error(err) {
						subscriber.error(err);
					},
					complete() {
						subscriptions.delete(innerSubscription);
						if (subscriptions.size === 0) {
							subscriber.complete();
						}
					},
				});
				subscriptions.add(innerSubscription);
			};

			const sourceSubscription = source.subscribe({
				next(value) {
					subscriber.next(value);
					subscribeToProjection(value);
				},
				error(err) {
					subscriber.error(err);
				},
				complete() {
					subscriptions.delete(sourceSubscription);
					if (subscriptions.size === 0) {
						subscriber.complete();
					}
				},
			});
			subscriptions.add(sourceSubscription);

			return () => {
				subscriptions.forEach((sub) => sub.unsubscribe());
			};
		});
	};
}

export default expand;
