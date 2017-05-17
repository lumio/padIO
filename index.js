const listener = require( './listener' );
const midi = require( './lib/midi' );

if ( process.argv.indexOf( '--list' ) > -1 ) {
  console.log( midi.list().join( '\n' ) );
  process.exit( 0 );
}
else {
  listener();
}