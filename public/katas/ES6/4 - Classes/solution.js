class Nerd extends Human {
	constructor(food, name) {
		super(name);
		if (food) {
			this.food = food;
		}
	}

	isHungry() {
		return this.food < 25;
	}

	talk(word) {
		return `Hola k ase, ${super.talk(word)}`;
	}
}
