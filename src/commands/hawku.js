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

// takes a number, such as 54.24324839024832, and truncates it to 54.24 - it does NOT round it up, simply truncates it.
truncate = function(number, places) {
  var shift = Math.pow(10, places);

  return ((number * shift) | 0) / shift;
};

module.exports = {
  /**
   * Reads the Hawku config file, then returns the width and height for
   * both the current active area and max active area.
   */
  getArea: () => {
    const settings = loadConfigFile();

    return {
      width: truncate(settings.TabletArea.Width.text,2),
      height: truncate(settings.TabletArea.Height.text,2),
      maxWidth: truncate(settings.TabletFullArea.Width.text,2),
      maxHeight: truncate(settings.TabletFullArea.Height.text,2),
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
