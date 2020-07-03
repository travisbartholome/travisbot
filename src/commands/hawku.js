const fs = require('fs');
const { xml2js } = require('xml-js');

const config = require('../../config');

const hawkuConfigFilePath = config.commands.hawkuPath;

// Options for xml2js conversion
const xmlOptions = {
  compact: true,
  ignoreAttributes: true,
  ignoreDeclaration: true,
  nativeType: true,
  nativeTypeAttributes: true,
  textKey: 'text',
};

// Run every time this command is run, in case the user changes their configuration
// This loads the entire config file into a JS object after converting it
const loadConfigFile = () => xml2js(
  fs.readFileSync(hawkuConfigFilePath, 'utf8'), xmlOptions,
).Configuration;

module.exports = {
  /**
   * Reads the Hawku config file, then returns the width and height for
   * both the current active area and max active area.
   */
  getArea: () => {
    const settings = loadConfigFile();

    return {
      width: settings.TabletArea.Width.text,
      height: settings.TabletArea.Height.text,
      maxWidth: settings.TabletFullArea.Width.text,
      maxHeight: settings.TabletFullArea.Height.text,
    };
  },

  /**
   * Gets detailed settings from the Hawku config file.
   */
  getDetails: () => {
    const settings = loadConfigFile();

    return {
      forcedAspectRatio: settings.ForceAspectRatio.text,
      fullArea: settings.ForceFullArea.text,
      smoothing: settings.SmoothingEnabled.text,
      outputMode: settings.OutputMode.text,
      resolution: `${settings.ScreenArea.Width.text}x${settings.ScreenArea.Height.text}`,
    };
  },
};
