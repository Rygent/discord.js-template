import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import path from 'node:path';
import glob from 'glob';
import 'dotenv/config';
const globber = promisify(glob);

export async function deploy() {
	const main = fileURLToPath(new URL('../src/index.js', import.meta.url));
	const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

	const commands = [];
	await globber(`${directory}Interactions/**/*.js`).then(async (interactions) => {
		for (const interactionFile of interactions) {
			const { default: interaction } = await import(pathToFileURL(interactionFile));
			commands.push(interaction);
		}
	});

	const rest = new REST({ version: 9 }).setToken(process.env.DISCORD_TOKEN);

	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [...commands] });
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}

deploy();
