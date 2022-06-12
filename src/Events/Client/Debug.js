import Event from '../../Structures/Event.js';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'debug',
			once: false
		});
	}

	async run(info) {
		if (!this.client.debug) return;
		console.log(info);
	}

}
