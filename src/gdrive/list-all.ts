import { OAuth2Client } from 'google-auth-library';
import { drive_v3, google } from 'googleapis';

export async function listAll(auth: OAuth2Client, parent: string): Promise<drive_v3.Schema$File[]> {
  const drive = google.drive({ version: 'v3', auth });
  const files: drive_v3.Schema$File[] = [];
  let pageToken: string = undefined;

  do {
    const response = await drive.files.list({
      pageSize: 1000,
      fields: 'files(name, id, mimeType, owners), nextPageToken',
      q: `parents in \'${parent}\'`,
      orderBy: 'folder',
      pageToken,
    });

    files.push(...response.data.files);
    pageToken = response.data.nextPageToken;
  } while (pageToken !== undefined)

  return files;
}

// q: `mimeType = \'application/vnd.google-apps.folder\' and parents in \'${parent}\'`
// q: 'parents in \'1y_LqTivQoTyaysmnmgjtXVVHDEuU2gwo\''
// files(id, name, exportLinks), nextPageToken
// exportLinks.application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// application/vnd.openxmlformats-officedocument.wordprocessingml.document