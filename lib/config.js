const yaml = require( 'js-yaml' );
const fs = require( 'fs' );

function getConfig( configFile, callback = () => {} ) {
  fs.readFile( configFile, 'utf8', ( err, data ) => {
    if ( err ) {
      return callback( err );
    }

    try {
      const obj = yaml.safeLoad( data.toString() )
      return callback( null, obj );
    }
    catch ( e ) {
      return callback( e );
    }
  } );
}

/**
 *
 */
module.exports = function( configFile = './config.yml', callback = () => {} ) {
  getConfig( configFile, callback );
  fs.watch( configFile, ( eventType, filename ) => {
    getConfig( configFile, callback );
  } );
}
