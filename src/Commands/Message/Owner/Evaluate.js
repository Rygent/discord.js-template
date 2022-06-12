import Command from '../../../Structures/Command.js';
import { Formatters, MessageAttachment } from 'discord.js';
import { Type } from '@anishshobith/deeptype';
import { inspect } from 'node:util';
import process from 'node:process';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'evaluate',
			aliases: ['eval'],
			description: 'Evaluating javascript code.',
			category: 'Owner',
			ownerOnly: true
		});
	}

	async run(message, args) {
		if (!args.length) return message.reply({ content: `Please enter the javascript code that will be evaluated.` });
		let code = args.join(' ');
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		let evaled;
		try {
			const start = process.hrtime();
			evaled = eval(code);
			if (evaled instanceof Promise) {
				evaled = await evaled;
			}
			const stop = process.hrtime(start);
			const content = [
				`**Output:** ${Formatters.codeBlock('js', this.clean(inspect(evaled, { depth: 0 })))}`,
				`**Type:** ${Formatters.inlineCode(new Type(evaled).is)}`,
				`**Time:** ${Formatters.inlineCode(`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms`)}`
			];
			const response = content.join('\n');
			if (response.length < 2000) {
				return message.channel.send({ content: response });
			} else {
				const attachment = new MessageAttachment()
					.setName('output.txt')
					.setFile(Buffer.from(this.clean(inspect(evaled, { depth: 0 }))));

				return message.channel.send({ files: [attachment] });
			}
		} catch (error) {
			return message.channel.send({ content: `**Error:** ${Formatters.codeBlock('xl', this.clean(error))}` });
		}
	}

	clean(text) {
		if (typeof text === 'string') {
			text = text
				.replace(/`/g, `\`${String.fromCharCode(8203)}`)
				.replace(/@/g, `@${String.fromCharCode(8203)}`)
				.replace(new RegExp(this.client.token, 'gi'), 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');
		}
		return text;
	}

}
