// // Define message types and payloads
// type MessageType = "MOVE" | "ATTACK";
//
// interface Message {
// 	type: MessageType;
// 	payload?: any;
// }
//
// interface MoveMessage extends Message {
// 	type: "MOVE";
// 	payload: { dx: number; dy: number };
// }
//
// interface AttackMessage extends Message {
// 	type: "ATTACK";
// }
//
// // Union type for all possible messages
// export type ActorMessage = MoveMessage | AttackMessage;

export interface ActorMessage {
	type: string;
	payload?: any;
}
