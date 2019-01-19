import React from 'react';
import ReactDOM from 'react-dom';
import { Chord, Note } from 'tonal';

import {
  withChannel,
  KeyNumber,
  Velocity,
  Duration,
  clampToUint7
} from '@hughrawlinson/midimessage';

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
      console.log(Chord.intervals("Asus4"));
      Chord.notes("Asus4").map(n => `${n}4`).forEach(note => {
        notePlayer.playNote(clampToUint7(Note.midi(note) || 0), 127, 250);
      });
    });
  }
});

ReactDOM.render(<p>Midi!</p>, document.getElementById('root'));
