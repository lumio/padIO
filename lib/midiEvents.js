const midi = require( './midi' );

function checkDeviceListChange( callback = () => {}, length = 0 ) {
  const newDeviceList = midi.list();
  let newLength = length;

  if ( newLength !== newDeviceList.length ) {
    newLength = newDeviceList.length;
    callback( newDeviceList );
  }

  setTimeout( () => {
    process.nextTick( () => { checkDeviceListChange( callback, newLength ) } );
  }, 500 );
}

module.exports = function( devices, callback = () => {} ) {
  let deviceList = [];

  checkDeviceListChange( ( newDeviceList ) => {
    deviceList = newDeviceList;
    console.log( deviceList );
    callback();
  } );
}