import { Actor } from "./Actor";
import { ActorSystem } from "./ActorSystem";

type CardMessage =
	| { type: "attack"; targetId: string }
	| { type: "takeDamage"; amount: number };

type CardState = {
	health: number;
	attack: number;
};

export class CardActor extends Actor<CardMessage, CardState> {
	constructor(id: string, system: ActorSystem, state: CardState) {
		super(system, id, state);
	}

	protected async onReceive(message: CardMessage) {
		switch (message.type) {
			case "attack":
				console.log(`${this.id} attacks ${message.targetId}`);
				this.system.sendMessage(message.targetId, {
					type: "takeDamage",
					amount: this.getSnapshot().attack,
				});
				break;
			case "takeDamage":
				this.updateState({
					health: this.getSnapshot().health - message.amount,
				});

				const health = this.getSnapshot().health;
				console.log(
					`${this.id} takes ${message.amount} damage. Health left: ${health}`,
				);
				if (health <= 0) {
					console.log(`${this.id} has been destroyed.`);
					this.stop();
				}
				break;
		}
	}
}
