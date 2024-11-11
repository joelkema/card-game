// import { parentPort } from "worker_threads";
//
// if (!parentPort) {
// 	throw new Error("This module must be run in a worker thread");
// }
//
// parentPort.on("message", (message) => {
// 	const { actorId, message: msg } = message;
//
// 	console.log(`Received message for actor ${actorId}:`, msg);
//
// 	// Process message, put LOGIC here
//
// 	// Send response back to the main thread if needed
// 	parentPort?.postMessage({ actorId, message: "Done" });
// });
//
onmessage = (event) => {
	const { actorId, message: msg } = event.data;

	console.log(`Received message for actor ${actorId}:`, msg);

	// Process message, put LOGIC here

	// Send response back to the main thread if needed
	postMessage({ actorId, message: "Done" });
};
