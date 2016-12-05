async function bookRoomAsync(id) {
	try {
		const room = await asyncAPI.getRoom(id);
		const isAvailable = await asyncAPI.checkAvailability(room);

		if (isAvailable) {
			return await asyncAPI.bookRoom(room);
		}
	} catch (e) {}

	return false;
}
