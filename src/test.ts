import { ActorSystem } from "./actors/ActorSystem";
import { CardActor } from "./actors/CardActor";
import { EnemyActor } from "./actors/Enemy";
import { PlayerActor } from "./actors/Player";

// Actor System
const system = ActorSystem.default();

console.log("Starting the game ...");

// Create some cards
//
const card1 = system.spawn(CardActor, "card1", 5, 10); // Attack 5, Health 10
const card2 = system.spawn(CardActor, "card2", 3, 12); // Attack 3, Health 12
const card3 = system.spawn(CardActor, "card3", 4, 8); // Attack 4, Health 8

// Create player and enemy with decks of cards

const player1Deck = ["card1", "card2"];
const player2Deck = ["card3"];

const player1 = system.spawn(PlayerActor, "player1", player1Deck);
const player2 = system.spawn(PlayerActor, "player2", player2Deck);

// Send drawCard messages to players
system.sendMessage("player1", { type: "drawCard" });
system.sendMessage("player2", { type: "drawCard" });

// Player 1 plays a card and attacks with it
system.sendMessage("player1", { type: "playCard", cardId: "card1" });
system.sendMessage("card1", { type: "attack", targetId: "card3" });
