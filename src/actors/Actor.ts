import { ActorMessage } from "./ActorMessage";
import { ActorSystem } from "./ActorSystem";

type Message<T> = T;

// The Actor class is a base class for all actors in the system
// It provides a mailbox for incoming messages and a method for processing them
// Subclasses should override the `onReceive` method to define custom behavior
// The `receive` method is the entry point for messages
// The `stop` method is used to stop the actor
//
// @param M The type of messages this actor can receive
// @param S The type of the actor's state
export class Actor<M, S> {
	public id: string;
	private mailbox: Message<M>[];
	protected system: ActorSystem;
	private state: S;
	private running;

	constructor(system: ActorSystem, id: string, initialState: S) {
		this.id = id;
		this.system = system;
		this.mailbox = [];
		this.running = true;
		this.state = initialState;
	}

	// Method for receiving and processing messages
	async receive(message: Message<M>) {
		console.log(`Actor ${this.id} received message:`, message);
		console.log(`Actor ${this.id} is processing the message...`);
		console.log(`Actor ${this.id} is ${this.running ? "" : "not "}running...`);

		if (!this.running) return;

		this.mailbox.push(message);

		// If there is a response resolver (for `ask`), we handle it here
		this.processMailbox();
		// Override this method in subclasses to implement custom behavior
	}

	// Processes messages in the mailbox sequentially
	private async processMailbox() {
		while (this.mailbox.length > 0 && this.running) {
			const message = this.mailbox.shift();
			if (message) {
				try {
					await this.onReceive(message);
				} catch (error) {
					this.handleError(error, message);
				}
			}
		}
	}

	// Override this in subclasses to define custom behavior
	protected async onReceive(message: Message<M>): Promise<void> {
		console.log(`Actor ${this.id} received message:`, message);
	}

	// Handle errors in message processing
	private handleError(error: unknown, message: Message<M>) {
		console.error(`Error in Actor ${this.id} while processing message:`, error);
		console.warn(`Failed message:`, message);
	}

	// Stops this actor, prevents further message processing
	stop() {
		this.running = false;
		this.mailbox = [];
	}

	public getSnapshot(): S {
		return this.state;
	}

	protected updateState(newState: Partial<S>): void {
		this.state = { ...this.state, ...newState };
	}
}
