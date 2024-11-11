onmessage = (event) => {
	const { actorId, message } = event.data;
	console.log(`Received message for actor ${actorId}:`, message);
};
