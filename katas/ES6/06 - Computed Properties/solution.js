// Use 'computedName' const, it will exist in the test suite.
// const computedName = '??????';

// Write your Nerd class here!
class Nerd {
	constructor(food, name) {
		this.food = food;
		this.name = name;
	}

	// Write here!
	get isHungry() {
		return this.food < 25;
	}

	get [computedName]() {
		return `I'm ${this.name}`;
	}
}
