import { drive_v3 } from 'googleapis';

import { drive } from '../drive-manager';

interface Tree extends Partial<drive_v3.Schema$File> {
  children?: Tree[];
}

export async function undeprecateTree(tree: Tree) {
  const children = tree.children;

  if (children) {
    for (let child of children) {
    await drive.undeprecate(child);
    
    if (child.children) {
        child.children.forEach(async i => await undeprecateTree(i));
      }
    }
  }
}