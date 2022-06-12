import { ApplicationCommandType } from 'discord-api-types/v9';

export default {
	name: 'ping',
	description: 'Send a ping request.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
};
