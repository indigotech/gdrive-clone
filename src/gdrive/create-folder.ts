import { OAuth2Client } from 'google-auth-library';
import { drive_v3, google } from 'googleapis';

export async function createFolder(auth: OAuth2Client, name: string, parentId: string): Promise<drive_v3.Schema$File> {
  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.create({
    fields: 'name, id, mimeType, owners',
    requestBody: { name: name, parents: [parentId], mimeType: 'application/vnd.google-apps.folder' }
  });

  return response.data;
}