import { OAuth2Client } from 'google-auth-library';
import { drive_v3, google } from 'googleapis';

export async function undeprecateFile(auth: OAuth2Client, file: Partial<drive_v3.Schema$File>): Promise<drive_v3.Schema$File> {
  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.update({
    fileId: file.id,
    fields: 'name, id, mimeType, owners',
    requestBody: { name: file.name.replace('[DEPRECATED] - ', '') }
  });

  return response.data;
}