const midi = require( 'midi' );

const boundDevices = {};
let globalMessageCallback = () => {};

module.exports = {
  /**
   * Use property to store kind of global input object
   */
  input: null,

  /**
   * Returns a list of device names
   */
  list: function() {
    if ( !this.input ) {
      this.input = new midi.input();
    }
    const devices = [];
    const size = this.input.getPortCount();

    for ( let i = 0; i < size; i += 1 ) {
      devices.push( this.input.getPortName( i ) );
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
    globalMessageCallback = callback;
    const availableDevices = this.list();
    if ( !availableDevices.length ) {
      return;
    }

    const unbind = Object.keys( boundDevices ).filter( deviceName => (
      bind.indexOf( deviceName ) === -1
    ) );
    unbind.map( deviceName => {
      const boundDevice = boundDevices[ deviceName ];
      if ( boundDevice && boundDevice.active ) {
        boundDevice.input.closePort();
        delete boundDevices[ deviceName ];
      }
    } );

    bind.forEach( ( deviceName ) => {
      const boundDevice = boundDevices[ deviceName ];
      const messageCallback = ( deltaTime, message ) => {
        globalMessageCallback( deviceName, deltaTime, message );
      };

      if ( boundDevice && boundDevice.active === true ) {
        return;
      }

      const portId = availableDevices.indexOf( deviceName );
      if ( !boundDevice && portId >= 0 ) {
        try {
          const input = new midi.input();
          input.on( 'message', messageCallback );
          boundDevices[ deviceName ] = {
            active: true,
            input,
          };
          input.openPort( portId );
        }
        catch ( e ) {
          console.error( e );
        }
      }
    } );
  },
}
