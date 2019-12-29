import { OAuth2Client } from 'google-auth-library';
import { drive_v3, google } from 'googleapis';

export async function copyFile(auth: OAuth2Client, file: Partial<drive_v3.Schema$File>, parentId: string): Promise<drive_v3.Schema$File> {
  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.copy({
    fileId: file.id,
    fields: 'name, id, mimeType, owners',
    requestBody: { name: file.name, parents: [parentId] }
  });

  return response.data;
}