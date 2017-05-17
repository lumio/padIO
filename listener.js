const config = require( './lib/config' );
const midiEvents = require( './lib/midiEvents' );

module.exports = function() {
  let configObj = {};
  let unbindFunction = false;
  config( './config.yml', ( err, obj ) => {
    if ( err ) {
      return console.error( err );
    }

    if ( typeof unbindFunction === 'function' ) {
      unbindFunction();
    }

    configObj = obj;
    const devices = Object.keys( obj.input );
    unbindFunction = midiEvents( devices );
  } );
}
