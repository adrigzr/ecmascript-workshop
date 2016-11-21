import Ember from 'ember';

export default Ember.Controller.extend({
	leftSideBarOpen: false,

	actions: {
		toggleMenu() {
			this.toggleProperty('leftSideBarOpen');
		}
	}
});
