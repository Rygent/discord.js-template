import Event from '../../Structures/Event.js';
import process from 'node:process';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'unhandledRejection',
			once: false,
			emitter: process
		});
	}

	async run(error, promise) { // eslint-disable-line no-unused-vars
		console.error(error);
	}

}
