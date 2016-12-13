
// Rewrite this function with async api:
// - asyncAPI.getRoom(id)
// - asyncAPI.checkAvailability(room)
// - asyncAPI.bookRoom(id)
//
// New function signature:
// - bookRoomAsync(id)
// - @returns Boolean
function bookRoomCB(id, callback) {
	cbAPI.getRoom(id, function(err, room) {
		if (err) {
			callback(null, false);
			return;
		}

		cbAPI.checkAvailability(room, function(err, isAvailable) {
			if (err || !isAvailable) {
				callback(null, false);
				return;
			}

			cbAPI.bookRoom(room, function(err, ret) {
				if (err) {
					callback(null, false);
					return;
				}

				callback(null, ret);
			});
		});
	});
}

