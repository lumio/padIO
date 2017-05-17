const midi = require( 'midi' );

module.exports = {
  /**
   * Returns a list of device names
   */
  list: function() {
    const devices = [];
    const input = new midi.input();
    const size = input.getPortCount();

    for ( let i = 0; i < size; i += 1 ) {
      devices.push( input.getPortName( i ) );
    }

    return devices;
  },

  /**
   * Bind devices
   *
   * @param array bind         A list of names to listen to
   * @param function callback  A callback function when a MIDI message is received
   *                           ( parameters )
   * @return function Returns a function to unbind listeners
   */
  bind: function( bind, callback = () => {} ) {
    const input = new midi.input();

    console.log( input.getPortCount() )
    console.log( input.getPortName( 0 ) );

    input.on('message', function(deltaTime, message) {
      // The message is an array of numbers corresponding to the MIDI bytes:
      //   [status, data1, data2]
      // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
      // information interpreting the messages.
      // console.log('m:' + message + ' d:' + deltaTime);

      const [ cId, cSubId, value ] = message;
      console.log( cId, cSubId, value );

      // if ( cId === 144 && cSubId === 40 ) {
      //   console.log( 'open something' );
      //   exec( 'open /Applications/Adobe\\ Photoshop\\ CC\\ 2017/Adobe\\ Photoshop\\ CC\\ 2017.app' );
      // }
    });

    // Open the first available input port.
    input.openPort(0);
  },
}