module.exports = function( configObj, deviceName, deltaTime, message ) {
  if ( configObj.delay && deltaTime < configObj.delay ) {
    return;
  }
  console.log( deviceName, deltaTime, message );
}