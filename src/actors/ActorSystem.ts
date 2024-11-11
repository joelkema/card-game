import { Actor } from "./Actor";
import {
	Dispatcher,
	MainThreadDispatcher,
	ThreadPoolDispatcher,
} from "./Dispatcher";

export class ActorSystem {
	private dispatcher: Dispatcher;

	constructor(dispatcher: Dispatcher) {
		this.dispatcher = dispatcher;
	}

	static default() {
		return new ActorSystem(new MainThreadDispatcher());
	}

	static withWorker() {
		return new ActorSystem(new ThreadPoolDispatcher());
	}

	// Create a new actor and register it in the system
	actorOf<T extends Actor<any, any>>(
		actorClass: new (...args: any[]) => T,
		id: string,
		...args: any[]
	): T {
		return this.dispatcher.registerActor(actorClass, id, ...args);
	}
	// Dispatches a message to a specific actor by ID
	sendMessage<T>(actorId: string, message: T) {
		this.dispatcher.dispatch(actorId, message);
	}

	// Stops an actor and removes it from the system
	stop(actorId: string) {
		this.dispatcher.unregisterActor(actorId);
	}

	// Retrieves an actor by ID
	getActor(actorId: string) {
		return this.dispatcher.getActorById(actorId);
	}
}
