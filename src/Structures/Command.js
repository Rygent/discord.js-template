import { Permissions } from 'discord.js';

export default class Command {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.description = options.description || 'No description provided.';
		this.category = options.category || 'Miscellaneous';
		this.usage = options.usage || '';
		this.memberPermissions = new Permissions(options.memberPermissions).freeze();
		this.clientPermissions = new Permissions(options.clientPermissions).freeze();
		this.ownerOnly = options.ownerOnly || false;
		this.disabled = options.disabled || false;
	}

	async run(message, args) { // eslint-disable-line no-unused-vars
		throw new Error(`Command ${this.name} doesn't provide a run method!`);
	}

}
