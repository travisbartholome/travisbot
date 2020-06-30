const fs = require('fs');
const config = require('../../config');
const hawkuConfigFilePath = config.commands.hawkuPath
const { xml2js } = require('xml-js');

const options = {compact: true, ignoreDeclaration: true, ignoreAttributes: true, nativeTypeAttributes: true};

// Ran every time this command is ran, in-case the user changes their configuration
// This loads the entire file into a JS object after converting it
const loadConfigFile = () => {
    return xml2js(
      fs.readFileSync(hawkuConfigFilePath, 'utf8'), options
    ).Configuration;
  }

module.exports = {

    getArea: function() {
        // This runs the loadConfigFile function, which returns the entire file as a JS object
        // It then returns the 4 values (current area, and max area) to the caller
        const settings = loadConfigFile();
        return { 
            width: settings.TabletArea.Width._text, 
            height: settings.TabletArea.Height._text, 
            maxWidth: settings.TabletFullArea.Width._text, 
            maxHeight: settings.TabletFullArea.Height._text 
        };
    },

    getDetails: () => {
        const settings = loadConfigFile();
        return { 
            forcedAspectRatio: settings.ForceAspectRatio._text === 'true', 
            fullArea: settings.ForceFullArea._text === 'true', 
            smoothing: settings.SmoothingEnabled._text,
            outputMode: settings.OutputMode._text,
            resolution: `${settings.ScreenArea.Width._text}x${settings.ScreenArea.Height._text}`
        }
    }
};
