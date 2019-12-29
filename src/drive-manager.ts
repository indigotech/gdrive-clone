require('dotenv').config();

import { Drive } from './gdrive/drive';

export const drive = new Drive();

export async function initDrive() {
  await drive.init(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
}
