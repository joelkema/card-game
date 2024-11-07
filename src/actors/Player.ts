import { Actor } from "./Actor";
import { ActorSystem } from "./ActorSystem";

type PlayerMessage =
	| { type: "playCard"; cardId: string }
	| { type: "takeDamage"; damage: number }
	| { type: "drawCard" };

type PlayerState = {
	health: number;
	// Stores card IDs
	deck: string[];
	hand: string[];
};

const defaultState: PlayerState = {
	health: 20,
	deck: [],
	hand: [],
};

export class PlayerActor extends Actor<PlayerMessage, PlayerState> {
	constructor(
		id: string,
		system: ActorSystem,
		state: PlayerState = defaultState,
	) {
		super(system, id, state);
	}

	protected async onReceive(message: PlayerMessage) {
		switch (message.type) {
			case "drawCard": {
				const { deck, hand } = this.getSnapshot();

				if (deck.length > 0) {
					const cardId = [...deck].shift();

					if (cardId) {
						this.updateState({
							deck: deck.filter((card) => card !== cardId),
							hand: [...hand, cardId],
						});
						console.log(`Player ${this.id} draws card ${cardId}`);
					}
				} else {
					console.log(`Player ${this.id} has no more cards to draw.`);
				}
				break;
			}
			case "playCard": {
				const { hand } = this.getSnapshot();

				if (hand.includes(message.cardId)) {
					console.log(`Player ${this.id} plays card ${message.cardId}`);
					this.updateState({
						hand: hand.filter((card) => card !== message.cardId),
					});
				} else {
					console.log(
						`Card ${message.cardId} not in hand for Player ${this.id}`,
					);
				}
				break;
			}
			case "takeDamage": {
				this.updateState({
					health: this.getSnapshot().health - message.damage,
				});

				const { health } = this.getSnapshot();

				if (health <= 0) {
					console.log(`Player ${this.id} has been defeated!`);
					this.system.stop(this.id);
				}
				break;
			}
		}
	}
}
