import Event from '../../Structures/Event.js';
import { default as Util } from '../../Structures/Util.js';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'messageCreate',
			once: false
		});
	}

	async run(message) {
		if (message.author.bot && !message.inGuild()) return;

		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.content.match(mentionRegex)) {
			return message.reply({ content: `My prefix here is \`${this.client.prefix}\`.` });
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;
		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (command.disabled && !this.client.owners.includes(message.author.id)) return;

			if (message.inGuild()) {
				const memberPermCheck = command.memberPermissions ? this.client.defaultPermissions.add(command.memberPermissions) : this.client.defaultPermissions;
				if (memberPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(memberPermCheck);
					if (missing.length) {
						return message.reply({ content: `You lack the ${Util.formatArray(missing.map(perms => `***${Util.formatPermissions(perms)}***`))} permission(s) to continue.` });
					}
				}

				const clientPermCheck = command.clientPermissions ? this.client.defaultPermissions.add(command.clientPermissions) : this.client.defaultPermissions;
				if (clientPermCheck) {
					const missing = message.channel.permissionsFor(message.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return message.reply({ content: `I lack the ${Util.formatArray(missing.map(perms => `***${Util.formatPermissions(perms)}***`))} permission(s) to continue.` });
					}
				}
			}

			if (command.ownerOnly && !this.client.owners.includes(message.author.id)) return;

			try {
				await message.channel.sendTyping();
				await command.run(message, args);
			} catch (error) {
				console.error(error.stack);

				return message.reply({ content: 'An error has occured when executing this command.' });
			}
		}
	}

}
