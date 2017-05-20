const config = require( './lib/config' );
const midi = require( './lib/midi' );
const midiInputChangeListener = require( './lib/midiInputChangeListener' );
const execMessage = require( './lib/execMessage' );

let initialRebind = true;
let configObj = {};
let unbindFunction = null;
let wantedDevices = [];
let currentListener = null;
function rebindListener( configObj, wantedDevices, unbindFunction ) {
  if ( wantedDevices.length === 0 && initialRebind === true ) {
    initialRebind = false;
    return;
  }

  if ( typeof unbindFunction === 'function' ) {
    unbindFunction();
  }

  midi.bind( wantedDevices, ( deviceName, deltaTime, message ) => {
    execMessage( configObj, deviceName, deltaTime, message );
  } );
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
