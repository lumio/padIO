const config = require( './lib/config' );
const midiInputChangeListener = require( './lib/midiInputChangeListener' );

let configObj = {};
let unbindFunction = null;
let wantedDevices = [];
let currentListener = null;
function rebindListener( configObj, wantedDevices, unbindFunction ) {
  if ( typeof unbindFunction === 'function' ) {
    unbindFunction();
  }
}

module.exports = function() {
  config( './config.yml', ( err, obj ) => {
    if ( err ) {
      return console.error( err );
    }
    configObj = obj;
    wantedDevices = Object.keys( obj.input );
    unbindFunction = rebindListener( configObj, wantedDevices, unbindFunction );
  } );

  midiInputChangeListener( () => {
    unbindFunction = rebindListener( configObj, wantedDevices, unbindFunction );
  } );
}
