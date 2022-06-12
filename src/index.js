import 'dotenv/config';

import BaseClient from './Structures/BaseClient.js';
import * as Configuration from './Utils/Configuration.js';

const client = new BaseClient(Configuration);
client.start();
