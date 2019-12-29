import * as yargsLib from 'yargs';
import * as fs from 'fs';

import { initDrive } from './src/drive-manager';
import { buildTree } from './src/scripts/build-tree';
import { cloneTree } from './src/scripts/clone-tree';
import { undeprecateTree } from './src/scripts/undeprecate-tree';

yargsLib
  .command(
    ['copy [folderId]', 'cp [folderId]'],
    'copies all children files and folders and deprecate the original',
    yargs => {
      yargs.positional('folderId', { description: 'parent folder id',  })
           .demandOption('folderId')
    },
    async args => {
      await initDrive();
      const tree = await buildTree(args['folderId'] as any);
      fs.writeFileSync('original_tree.json', JSON.stringify(tree, null, 2));
      const clonedTree = await cloneTree(tree);
      fs.writeFileSync('cloned_tree.json', JSON.stringify(clonedTree, null, 2));
      console.log('Done');
    }
  )
  .command(
    ['undeprecate [folderId]', 'un [folderId]'],
    'undepreacte',
    yargs => {
      yargs.positional('folderId', { description: 'parent folder id',  })
           .demandOption('folderId')
    },
    async args => {
      await initDrive();
      const tree = await buildTree(args['folderId'] as any);
      await undeprecateTree(tree);
      console.log('Done');
    }
  )
  .command(
    ['list [folderId]', 'ls [folderId]'],
    'lists all files and subfolders of a given folder',
    yargs => {
      yargs.positional('folderId', { description: 'parent folder id',  })
           .demandOption('folderId')
    },
    async args => { 
      await initDrive();
      const tree = await buildTree(args['folderId'] as any);
      fs.writeFileSync('tree.json', JSON.stringify(tree, null, 2))
      console.log('Done');
    }
  )
  .demandCommand()
  .help()
  .argv;