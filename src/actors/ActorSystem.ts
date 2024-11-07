import { Actor } from "./Actor";
import { ActorMessage } from "./ActorMessage";

export class ActorSystem {
	private actors: Map<string, Actor> = new Map();

	static default() {
		return new ActorSystem();
	}

	// Create a new actor and register it in the system
	spawn<T extends Actor<any>>(
		actorClass: new (...args: any[]) => T,
		id: string,
		...args: any[]
	): T {
		const actor = new actorClass(id, this, ...args);
		this.actors.set(id, actor);
		return actor;
	}
	// Dispatches a message to a specific actor by ID
	sendMessage<T>(actorId: string, message: T) {
		const actor = this.actors.get(actorId);
		if (actor) {
			actor.receive(message);
		} else {
			console.warn(`Actor with ID ${actorId} does not exist`);
		}
	}

	// Stops an actor and removes it from the system
	stop(actorId: string) {
		const actor = this.actors.get(actorId);
		if (actor) {
			actor.stop();
			this.actors.delete(actorId);
		}
	}
}
