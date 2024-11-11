import { Actor } from "./Actor";
import { Worker } from "worker_threads";

export interface Dispatcher {
	getActorById: (actorId: string) => Actor<any, any> | undefined;
	dispatch: (actorId: string, message: any) => void;
	registerActor: <T extends Actor<any, any>>(
		actorClass: new (...args: any[]) => T,
		id: string,
		...args: any[]
	) => T;
	unregisterActor: (actorId: string) => void;
}

class BaseDispatcher implements Dispatcher {
	protected actors: Map<string, Actor<any, any>> = new Map();

	getActorById(actorId: string) {
		return this.actors.get(actorId);
	}

	dispatch(actorId: string, message: any) {
		const actor = this.getActorById(actorId);
		if (actor) {
			actor.receive(message);
		} else {
			console.warn(`Actor with ID ${actorId} does not exist`);
		}
	}

	registerActor<T extends Actor<any, any>>(
		actorClass: new (...args: any[]) => T,
		id: string,
		...args: any[]
	): T {
		const actor = new actorClass(id, this, ...args);
		this.actors.set(id, actor);
		return actor;
	}

	unregisterActor(actorId: string) {
		this.actors.delete(actorId);
	}
}

/**
 * Dispatcher that runs on the main thread
 * and dispatches messages synchronously.
 * This is the default dispatcher for the ActorSystem.
 */
export class MainThreadDispatcher extends BaseDispatcher {}

/**
 * Dispatcher that runs on a separate worker thread
 * and dispatches messages asynchronously.
 */
export class ThreadPoolDispatcher extends BaseDispatcher {
	private workerPool: Map<string, Worker> = new Map();

	registerActor<T extends Actor<any, any>>(
		actorClass: new (...args: any[]) => T,
		id: string,
		...args: any[]
	): T {
		const actor = super.registerActor(actorClass, id, ...args);

		// get type of T
		const actorType = actor.constructor.name;
		const workerFilePath = this.getWorkerFilePath(actorType);

		if (this.workerPool.has(actorType)) {
			return actor;
		}

		const worker = new Worker("./worker.ts");

		this.workerPool.set(actorType, worker);

		// Listen for responses from the worker
		worker.onmessage = (event) => {
			const { actorId, message } = event.data;
			console.log(`Received message for actor ${actorId}:`, message);
		};

		return actor;
	}

	dispatch(actorId: string, message: any): void {
		const actor = this.getActorById(actorId);
		const actorType = actor?.constructor.name;
		const worker = this.workerPool.get(actorType);

		debugger;

		if (worker) {
			worker.postMessage({ actorId, message });
		} else {
			console.warn(`Worker for actor ${actorId} does not exist`);
		}
	}

	getWorkerFilePath(actorType: string): string {
		return "worker?worker";
		if (actorType === "PlayerActor") {
			return `./workers/playerActorWorker?worker`;
		}

		if (actorType === "CardActor") {
			return `./workers/cardActorWorker?worker`;
		}

		return `./workers/${actorType}Worker?worker`;
	}
}
