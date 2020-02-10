#!/usr/bin/env node

import { Command } from 'commander';
import { setLogging } from './utils/logger';

import { buildProject } from './index';

const program = new Command();
program
  .command('build')
  .description('builds extensions')
  .option('-c, --config <config path>', 'specify the config file')
  .option('--debug', 'show debugging information')
  .action((cmd) => {
    setLogging(cmd.debug);
    return buildProject({
      configPath: cmd.config
    });
  });
program.parse(process.argv);

export default program;

// TODO: scaffold project

// build project
// Compile assets:
/*
 out/
  chrome-extension/
    includes**
    manifest.json
  mozilla-extension/
    includes**
    manifest.json
*/
