import { Client, Intents, Permissions } from 'discord.js';
import { Collection } from '@discordjs/collection';
import Util from './Util.js';
import semver from 'semver';

export default class BaseClient extends Client {

	constructor(options = {}) {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES
			],
			partials: ['CHANNEL'],
			allowedMentions: {
				parse: ['users', 'roles'],
				repliedUser: false
			}
		});

		this.validate(options);

		this.interactions = new Collection();
		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();

		this.utils = new Util(this);
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');
		if (semver.lt(process.versions.node, '16.6.0')) throw new Error('This client requires Node.js v16.6.0 or higher.');
		this.debug = options.debug;

		if (!options.token) throw new Error('You must pass the token for the Client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the Client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.owners.length) throw new Error('You must pass a list of owner(s) for the Client.');
		if (!Array.isArray(options.owners)) throw new TypeError('Owner(s) should be a type of Array<String>.');
		this.owners = options.owners;

		if (!options.defaultPermissions.length) throw new Error('You must pass default permission(s) for the Client.');
		if (!Array.isArray(options.defaultPermissions)) throw new TypeError('Permission(s) should be a type of Array<String>.');
		this.defaultPermissions = new Permissions(options.defaultPermissions).freeze();
	}

	async start(token = this.token) {
		this.utils.loadInteractions();
		this.utils.loadCommands();
		this.utils.loadEvents();
		super.login(token);
	}

}
