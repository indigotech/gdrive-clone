import { drive_v3 } from 'googleapis';

import { drive } from '../drive-manager';

interface Tree extends Partial<drive_v3.Schema$File> {
  children?: Tree[];
}

export async function cloneTree(tree: Tree, parentId?: string) {
  const children = tree.children;

  if (parentId) {
    const oldTree = tree;
    tree = await drive.createFolder(tree.name, parentId);
    await drive.deprecate(oldTree);
  }

  const newChildren = [];

  for (let child of children) {
    if (child.mimeType) {
      console.log(`Copying file: ${child.name}`);
      newChildren.push(await drive.copyFile(child, tree.id));
      await drive.deprecate(child);
    } else {
      newChildren.push(await cloneTree(child, tree.id));
    }
  }

  return { ...tree, children: newChildren };
}