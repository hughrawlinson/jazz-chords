import React from 'react';
import ReactDOM from 'react-dom';

import { withChannel, KeyNumber, Velocity, Duration } from './midimessage/index';

const notes = withChannel(0);

function withPort(port: WebMidi.MIDIOutput) {
  return {
    playNote: (key: KeyNumber, v: Velocity, d: Duration) => {
      port.send(notes.noteOn(key, v));
      setTimeout(() => port.send(notes.noteOff(key, 0)), d);
    }
  }
}

navigator.requestMIDIAccess().catch(console.log).then(midiAccess => {
  if (midiAccess) {
    midiAccess.outputs.forEach((port, key) => {
      const notePlayer = withPort(port);
      notePlayer.playNote(60, 127, 250);
    });
  }
});

ReactDOM.render(<p>Midi!</p>, document.getElementById('root'));
