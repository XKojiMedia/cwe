import { generateExtensionInfo, compileExtension } from './mozilla';
import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
const webExtModule = require('web-ext');

jest.useFakeTimers();

jest.mock('path');
jest.mock('fs');
jest.mock('fs-extra');

describe('mozilla target', () => {
  describe('generateExtensionInfo', () => {
    it('should generate empty content if no manifest option', async () => {
      const extensionInfo = await generateExtensionInfo({
        exclude: [],
        include: [],
        outDir: '',
        rootDir: '',
        targets: [],
      });
      expect(extensionInfo.content).toBe('');
      expect(extensionInfo.fileName).toBe('manifest.json');
      expect(extensionInfo.fileType).toBe('json');
    });

    it('should generate the manifest content if manifest option provided', async () => {
      const extensionInfo = await generateExtensionInfo({
        exclude: [],
        include: [],
        outDir: '',
        rootDir: '',
        targets: [],
        manifestOptions: {
          name: 'Test extension',
          version: '0.0.1',
          backgroundOptions: {
            scripts: []
          },
          browserAction: {
            defaultIcon: '',
            defaultTitle: '',
            defaultPopup: '',
          },
          contentSecurityPolicy: '',
          description: 'Test extension description',
          icons: '',
          offlineEnabled: false,
          pageAction: {
            defaultIcon: '',
            defaultTitle: '',
            defaultPopup: '',
          },
          permissions: [],
          settingsOptions: {
            page: '',
            openInTab: false,
          },
          shortName: 'Test'
        }
      });
      expect(extensionInfo.content).toBeTruthy();
      expect(JSON.parse(extensionInfo.content)).toMatchSnapshot();
      expect(extensionInfo.fileName).toBe('manifest.json');
      expect(extensionInfo.fileType).toBe('json');
    });
  });

  describe('compileExtension', () => {
    it('should call web-ext build command with specified parameters', async () => {
      await compileExtension({
        config: {
          exclude: [],
          include: [],
          outDir: '',
          rootDir: '',
          targets: [],
        },
        extensionBuildOutputDir: 'path/to/output',
        extensionFilesDir: 'path/to/files',
      });

      expect(webExtModule.default.cmd.build).toHaveBeenCalledWith({
        sourceDir: 'path/to/files',
        artifactsDir: 'path/to/output',
        overwriteDest: true
      });
    });
  });
});