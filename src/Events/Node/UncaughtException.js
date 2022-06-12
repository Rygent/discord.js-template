import Event from '../../Structures/Event.js';
import process from 'node:process';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'uncaughtException',
			once: false,
			emitter: process
		});
	}

	async run(error, origin) { // eslint-disable-line no-unused-vars
		console.error(error);
	}

}
