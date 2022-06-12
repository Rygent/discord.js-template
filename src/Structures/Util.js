import { URL } from 'node:url';
import { promisify } from 'node:util';
import path from 'node:path';
import glob from 'glob';
import Command from './Command.js';
import Event from './Event.js';

const globber = promisify(glob);

export default class Util {

	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().slice(0, 5) === 'class';
	}

	get directory() {
		const { pathname } = new URL('../index.js', import.meta.url);
		return `${path.dirname(pathname.slice(1)) + path.sep}`.replace(/\\/g, '/');
	}

	async loadCommands() {
		return globber(`${this.directory}Commands/?(Message)/**/*.js`).then(async (commands) => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
				const { default: File } = await import(`file://${commandFile}`);
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands directory.`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	async loadEvents() {
		return globber(`${this.directory}Events/**/*.js`).then(async (events) => {
			for (const eventFile of events) {
				const { name } = path.parse(eventFile);
				const { default: File } = await import(`file://${eventFile}`);
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events directory.`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](event.name, (...args) => event.run(...args));
			}
		});
	}

}
