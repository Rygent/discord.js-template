import Event from '../../Structures/Event.js';

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
