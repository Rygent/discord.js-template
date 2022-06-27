import Command from '../../../Structures/Command.js';
import { Formatters, MessageEmbed, version as DJSVersion } from 'discord.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import { Colors } from '../../../Utils/Constants.js';
import { default as Util } from '../../../Structures/Util.js';
import pkg from '../../../../package.json' assert { type: 'json' };
import os from 'node:os';

const { version: BOTVersion } = pkg;

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'about',
			aliases: ['botinfo', 'info'],
			description: 'Get bots information.',
			category: 'Miscellaneous'
		});
	}

	async run(message) {
		const duration = new DurationFormatter();

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setAuthor({ name: this.client.user.tag, iconURL: this.client.user.displayAvatarURL({ dynamic: true }) })
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***ID:*** \`${this.client.user.id}\``,
				`***Developer:*** ${Util.formatArray(this.client.owners.map(user => Formatters.userMention(user)))}`,
				`***Version:*** v${BOTVersion}`,
				`***Node.JS:*** ${process.version}`,
				`***Library:*** Discord.JS v${DJSVersion}`,
				`***Registered:*** ${Formatters.time(new Date(this.client.user.createdAt), 'D')} (${Formatters.time(new Date(this.client.user.createdAt), 'R')})`
			].join('\n'))
			.addFields([{ name: '__System__', value: [
				`***Platform:*** ${os.type} ${os.release} ${os.arch}`,
				`***CPU:*** ${os.cpus()[0].model} ${os.cpus().length} Cores ${os.cpus()[0].speed}MHz`,
				`***Memory:*** ${Util.formatBytes(process.memoryUsage().heapUsed)} / ${Util.formatBytes(process.memoryUsage().heapTotal)}`,
				`***Uptime:*** ${duration.format(this.client.uptime, undefined, { right: ', ' })}`,
				`***Host:*** ${duration.format(os.uptime * 1000, undefined, { right: ', ' })}`
			].join('\n'), inline: false }])
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL({ dynamic: true }) });

		return message.reply({ embeds: [embed] });
	}

}
