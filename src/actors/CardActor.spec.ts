import { expect, test } from "vitest";
import { ActorSystem } from "./ActorSystem";
import { CardActor } from "./CardActor";

const system = new ActorSystem();

test("should create an actor", () => {
	const actor = system.spawn(CardActor, "card1", 10, 3);

	expect(actor).toBeDefined();
	expect(actor.id).toBe("card1");
});
