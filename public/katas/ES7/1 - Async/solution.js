const planes = ['Boeing 777', 'Boeing 747', 'Boeing 737', 'Airbus A330'];

async function fly(plane) {
	return plane;
}

async function schedule() {
	await Promise.all(planes.map(plane => fly(planes)));
};
