const shellEscape = require( 'shell-escape' );
const exec = require( 'child_process' ).exec;

const COMPARISON_EQUAL = 0;
const COMPARISON_LOWERTHAN = 1;
const COMPARISON_GREATERTHAN = 2;

function relativePressureIsTrue( relativePressure, pressure ) {
  const firstChar = relativePressure.substr( 0, 1 );
  let comparisonType = 0;
  let isPercentage = relativePressure.substr( -1 ) === '%';
  let newRelativePressure = relativePressure;

  if ( firstChar === '<' ) {
    comparisonType = COMPARISON_LOWERTHAN;
  }
  else if ( firstChar === '>' ) {
    comparisonType = COMPARISON_GREATERTHAN;
  }

  if ( comparisonType !== COMPARISON_EQUAL ) {
    newRelativePressure = newRelativePressure.substr( 1 );
  }
  if ( isPercentage ) {
    newRelativePressure = ( parseFloat(
      newRelativePressure.substr( 0, newRelativePressure.length - 1 ),
      10
    ) / 100 ) * 127;
  }
  newRelativePressure = parseFloat( newRelativePressure, 10 );

  switch ( comparisonType ) {
    case COMPARISON_EQUAL:
      return pressure === newRelativePressure;
    case COMPARISON_LOWERTHAN:
      return pressure < newRelativePressure;
    case COMPARISON_GREATERTHAN:
      return pressure > newRelativePressure;
  }
}

function shouldBeExecuted( condition, message ) {
  let [ status, key, pressure ] = condition.split( '+' );
  status = parseInt( status, 10 );
  key = parseInt( key, 10 );

  if ( status === message[ 0 ] && key === message[ 1 ] ) {
    if ( typeof pressure === 'undefined' ) {
      return true;
    }
    else if ( relativePressureIsTrue( pressure, message[ 2 ] ) ) {
      return true;
    }
  }

  return false;
}

function runCommand( command ) {
  if ( command.exec ) {
    exec( command.exec );
  }

  if ( command.open ) {
    exec( shellEscape( [ 'open', command.open ] ) );
  }
}

module.exports = function( configObj, deviceName, deltaTime, message ) {
  if ( !configObj.input
    || ( deltaTime !== 0
      && configObj.delay
      && deltaTime < configObj.delay ) ) {
    return;
  }

  const input = configObj.input;
  const commands = input[ deviceName ];
  if ( !commands ) {
    return;
  }

  Object.keys( commands ).forEach( ( condition ) => {
    if ( shouldBeExecuted( condition, message ) ) {
      runCommand( commands[ condition ] );
    }
  } );
}