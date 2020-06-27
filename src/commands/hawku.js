const fs = require('fs');
const config = require('../../config');
const hawkuConfigFilePath = config.commands.areaPath + '/config.xml'
const convert = require('xml-js');

const options = {compact: true, ignoreDeclaration: true, ignoreAttributes: true, nativeTypeAttributes: true};

// Ran every time this command is ran, in-case the user changes their configuration
// This loads the entire file into a JS object after converting it
function loadConfigFile() {
    let hawkuUserSettings = require('fs').readFileSync(hawkuConfigFilePath, 'utf8');
    hawkuUserSettings = convert.xml2js(hawkuUserSettings, options);
    hawkuUserSettings = hawkuUserSettings.Configuration;
    return hawkuUserSettings;
}

module.exports = {

    GetAreas: function() {
        // This runs the loadConfigFile function, which returns the entire file as a JS object
        // It then builds two variables (current settings, and the dimensions of the tablet's full area)
        const settings = loadConfigFile().TabletArea;
        const fullArea = loadConfigFile().TabletFullArea;

        let areaWidth = settings.Width._text;
        let areaHeight = settings.Height._text;

        // place all of these values into a key/value pair, and return back to the parent caller
        let areas = { width: settings.Width._text, height: settings.Height._text, maxwidth: fullArea.Width._text, maxheight: fullArea.Height._text}
        return areas;
    },

    GetDetails: function() {
        let settings = loadConfigFile();

        settings = { 
            forcedAspectRatio: settings.ForceAspectRatio._text, 
            fullArea: settings.ForceFullArea._text, 
            smoothing: settings.SmoothingEnabled._text,
            outputMode: settings.OutputMode._text,
            resolution: `${settings.ScreenArea.Width._text}x${settings.ScreenArea.Height._text}`
        }
        return settings;
    }
};
