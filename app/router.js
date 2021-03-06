import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
	location: config.locationType,
	rootURL: config.rootURL
});

Router.map(function() {
	this.route('katas', { path: '/katas/:kata_slug' });
	this.route('help', { path: '/help/:kata_slug' });
});

export default Router;
