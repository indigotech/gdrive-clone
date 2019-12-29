import { drive_v3 } from 'googleapis';

import { drive } from '../drive-manager';

function isFolder(file: drive_v3.Schema$File) {
  return file.mimeType === 'application/vnd.google-apps.folder';
}

export async function buildTree(id: string, name?: string, owners: any[] = []) {
  console.log(`Listing files from ${name ?? id}`);

  const filesOrFolders = await drive.lisChildren(id);

  const files = filesOrFolders.filter(item => !isFolder(item));
  const folders = filesOrFolders.filter(isFolder);

  const children = [];

  for (let folder of folders) {
    const child = await buildTree(folder.id, folder.name, folder.owners);
    children.push(child);
  }

  return { id, name, filesCount: files.length, owners, children: [...children, ...files] };
}