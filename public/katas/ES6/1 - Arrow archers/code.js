// Archers is an array with the current structure:
// [{ arrows: 1 }, { arrows: 5 }, ...]
const contest = {
	// This array will be filled automatically when running test suite.
	archers: [],

	// This function will be called to test the exercise.
	archersReady() {
		return this.archers.every(/* Write here! */);
	}
};
