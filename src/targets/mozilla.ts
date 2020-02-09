import { CwexConfig, ManifestIcons, ManifestBrowserAction, ExtensionInfo, ExtensionCompiler, ManifestBrowserSpecificSettings } from '../config';
const webExt = require('web-ext').default;

interface MozillaAddonBackground {
  scripts: string[];
}
interface MozillaAddonOptionsUi {
  page: string;
  open_in_tab: boolean;
}

interface MozillaAddon {
  manifest_version: 2;
  name: string;
  short_name?: string;
  description?: string;
  version: string;
  icons?: ManifestIcons;
  browser_action?: ManifestBrowserAction;
  permissions?: string[];
  content_security_policy?: string;
  background?: MozillaAddonBackground;
  options_ui?: MozillaAddonOptionsUi;
  offline_enabled?: boolean;
  browser_specific_settings?: ManifestBrowserSpecificSettings;
}

const buildBrowserAction = (config: CwexConfig): ManifestBrowserAction => {
  if (config.manifestOptions?.browser_action) {
    return {
      default_icon: config.manifestOptions.browser_action.default_icon,
      default_popup: config.manifestOptions.browser_action.default_popup,
      default_title: config.manifestOptions.browser_action.default_title,
    };
  }
  return {};
};

const buildOptionsUi = (config: CwexConfig): MozillaAddonOptionsUi | undefined => {
  if (config.manifestOptions?.options_ui) {
    return {
      page: config.manifestOptions.options_ui.page,
      open_in_tab: config.manifestOptions.options_ui.open_in_tab,
    };
  }
  return undefined;
};

const buildExtensionData = (config: CwexConfig): MozillaAddon | null => {
  if (!config.manifestOptions) {
    return null;
  }

  return {
    manifest_version: 2,
    name: config.manifestOptions.name,
    short_name: config.manifestOptions.short_name,
    description: config.manifestOptions.description,
    version: config.manifestOptions.version,
    icons: config.manifestOptions.icons,
    browser_action: buildBrowserAction(config),
    permissions: config.manifestOptions.permissions,
    content_security_policy: config.manifestOptions.content_security_policy,
    background: config.manifestOptions.background,
    options_ui: buildOptionsUi(config),
    offline_enabled: config.manifestOptions.offline_enabled,
    browser_specific_settings: config.manifestOptions.browser_specific_settings,
  };
};

export const generateExtensionInfo = async(config: CwexConfig): Promise<ExtensionInfo> => {
  const extensionData = buildExtensionData(config);
  return {
    content: extensionData ? JSON.stringify(extensionData, null, 2): '',
    fileName: 'manifest.json',
    fileType: 'json',
  };
};

export default generateExtensionInfo;

export const compileExtension: ExtensionCompiler = async (opts) => {
  return await webExt.cmd.build({
    sourceDir: opts.extensionFilesDir,
    overwriteDest: true,
    artifactsDir: opts.extensionBuildOutputDir,
  });
};
