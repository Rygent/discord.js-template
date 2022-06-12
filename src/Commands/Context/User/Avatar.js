import Command from '../../../Structures/Interaction.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Colors } from '../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['Avatar']
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const button = new MessageButton()
			.setStyle('LINK')
			.setLabel('Open in Browser')
			.setURL(member.displayAvatarURL({ fromat: 'png', dynamic: true, size: 4096 }));

		const row = new MessageActionRow()
			.addComponents(button);

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
			.setDescription(`***ID:*** \`${member.user.id}\``)
			.setImage(member.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
	}

}
