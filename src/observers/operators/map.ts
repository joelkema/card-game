import { Observable } from "../Observable";

function map<T, R>(project: (value: T, index: number) => R) {
	return (source: Observable<T>): Observable<R> => {
		return new Observable<R>((subscriber) => {
			let index = 0;
			return source.subscribe({
				next(value) {
					try {
						const result = project(value, index++);
						subscriber.next(result);
					} catch (err) {
						subscriber.error(err);
					}
				},
				error(err) {
					subscriber.error(err);
				},
				complete() {
					subscriber.complete();
				},
			});
		});
	};
}

export default map;
