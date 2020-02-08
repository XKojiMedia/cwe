import { resolve, basename } from 'path';
import { remove, copy, outputFile } from 'fs-extra';
import { getConfig, ExtensionInfoBuilder } from '../config';
import { getFiles, getResolvedTargetModule } from '../utils';

export const buildProject = async ({ configPath = '' } = {}) => {
  console.log(process.cwd());
  const config = await getConfig(configPath);
  console.log('Config:', config);

  const outDir = resolve(config.rootDir, config.outDir);
  console.log('Resolved output directory:', outDir);

  console.log('Removing output directory..');
  await remove(outDir);

  console.log(`Building for ${config.targets.length} targets:`, config.targets);
  for (const target of config.targets) {
    const resolvedTargetModule = getResolvedTargetModule(target);
    console.log('resolved module:', resolvedTargetModule);
    if (!resolvedTargetModule) {
      console.log('No module found for target:', target);
      continue;
    }
    const generateExtensionInfo: ExtensionInfoBuilder = require(resolvedTargetModule).generateExtensionInfo;

    // TODO: Build target steps: beforeBuild:target, afterBuild:target

    console.log(generateExtensionInfo);
    // Compile templates with config data
    const extensionInfo = await generateExtensionInfo(config);
    console.log(`${target} extension info:`, extensionInfo);

    const includedFiles = await getFiles(config.include, {
      ignore: config.exclude,
      onlyFiles: false,
      expandDirectories: false,
      absolute: true,
    });
    console.log('Included files:', includedFiles);

    const extensionOutDir = resolve(outDir, `${target}-files`);
    console.log('Resolved output directory:', outDir);

    console.log('Removing output directory..');
    await remove(extensionOutDir);

    console.log('Copying included files to output directory..');
    for (const file of includedFiles) {
      await copy(file, resolve(extensionOutDir, basename(file)));
    }
  
    console.log('Copying manifest file to output directory..');
    const manifestOutputPath = resolve(extensionOutDir, extensionInfo.fileName);
    outputFile(manifestOutputPath, extensionInfo.content, 'utf8');
  
    console.log('Build completed.');
  }
};
