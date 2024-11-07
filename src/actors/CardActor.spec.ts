import { expect, test } from "vitest";
import { ActorSystem } from "./ActorSystem";
import { CardActor } from "./CardActor";

const system = new ActorSystem();

test("should create an actor", () => {
	const actor = system.spawn(CardActor, "card1");

	expect(actor).toBeDefined();
	expect(actor.id).toBe("card1");
});

test("should send a message to an actor", async () => {
	const actor = system.spawn(CardActor, "card1", { health: 10 });

	system.sendMessage("card1", { type: "takeDamage", amount: 2 });

	expect(actor.getSnapshot().health).toBe(8);
});
