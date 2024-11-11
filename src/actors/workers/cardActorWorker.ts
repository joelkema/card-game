self.onmessage = (event) => {
	const { actorId, message } = event.data;

	debugger;

	console.log(`Received message for actor ${actorId}:`, message);
};
