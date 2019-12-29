import { OAuth2Client } from 'google-auth-library';
import { drive_v3 } from 'googleapis';

import { copyFile } from './copy-file';
import { createFolder } from './create-folder';
import { getAuthClient } from './get-auth';
import { listAll } from './list-all';
import { deprecateFile } from './deprecate-file';

export class Drive {
  private client?: OAuth2Client;

  async init(clientId: string, clientSecret: string) {
    this.client = await getAuthClient(clientId, clientSecret);
  }

  lisChildren(parentId: string) {
    return listAll(this.client, parentId);
  }

  copyFile(file: Partial<drive_v3.Schema$File>, parentId: string) {
    return copyFile(this.client, file, parentId);
  }

  createFolder(name: string, parentId: string) {
    return createFolder(this.client, name, parentId);
  }

  deprecate(file: Partial<drive_v3.Schema$File>) {
    return deprecateFile(this.client, file);
  }
}