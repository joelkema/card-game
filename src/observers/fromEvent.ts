import { Observable } from "./Observable";

function fromEvent<T>(target: EventTarget, eventName: string): Observable<T> {
	return new Observable<T>((subscriber) => {
		const eventHandler = (event: Event) => {
			subscriber.next(event as T);
		};

		target.addEventListener(eventName, eventHandler);

		return () => {
			target.removeEventListener(eventName, eventHandler);
		};
	});
}

export default fromEvent;
