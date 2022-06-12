import Event from '../../Structures/Event.js';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'interactionCreate',
			once: false
		});
	}

	async run(interaction) {
		if (!interaction.isCommand() && !interaction.isContextMenu()) return;

		const command = this.client.interactions.get(this.getCommandName(interaction));
		if (command) {
			if (command.disabled && !this.client.owners.includes(interaction.user.id)) {
				return interaction.reply({ content: 'This command is currently inaccessible.', ephemeral: true });
			}

			if (command.guildOnly && !interaction.inGuild()) {
				return interaction.reply({ content: 'This command cannot be used out of a server.', ephemeral: true });
			}

			if (command.ownerOnly && !this.client.owners.includes(interaction.user.id)) {
				return interaction.reply({ content: 'This command is only accessible for developers.', ephemeral: true });
			}

			try {
				await command.run(interaction);
			} catch (error) {
				if (interaction.replied) return;
				console.error(error);

				if (interaction.deferred) return interaction.editReply({ content: 'An error has occured when executing this command.' });
				else return interaction.reply({ content: 'An error has occured when executing this command.', ephemeral: true });
			}
		}
	}

	getCommandName(interaction) {
		let command;
		const { commandName } = interaction;
		const subCommandGroup = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);

		if (subCommand) {
			if (subCommandGroup) {
				command = `${commandName}-${subCommandGroup}-${subCommand}`;
			} else {
				command = `${commandName}-${subCommand}`;
			}
		} else {
			command = commandName;
		}
		return command;
	}

}
