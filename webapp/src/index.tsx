import React from 'react';
import ReactDOM from 'react-dom';
import { Chord, Note } from 'tonal';

import {
  withChannel,
  KeyNumber,
  Velocity,
  Duration,
  clampToUint7,
  MidiByteArray
} from '@hughrawlinson/midimessage';

const notes = withChannel(0);

type scoreNote = [KeyNumber, Velocity, Duration]
type ScoreChord = Array<scoreNote>
type Score = Array<ScoreChord>

interface NotePlayer {
  playNote(k: KeyNumber, v: Velocity, d: Duration): void,
  playChord(s: ScoreChord, n: NotePlayer): void,
  playSequence(s: Score): void
}

function withPort(port: WebMidi.MIDIOutput) {
  const playNote = (key: KeyNumber, v: Velocity, d: Duration) => {
    port.send(notes.noteOn(key, v));
    setTimeout(() => port.send(notes.noteOff(key, 0)), d);
  }

  const playChord = (scoreChord: ScoreChord, notePlayer: NotePlayer) => {
      scoreChord.map(n => `${n}4`).forEach((note) => {
        notePlayer.playNote(clampToUint7(Note.midi(note) || 0), 127, 250);
      });
  }

  const playSequence = (sequence: Score) => {

  }

  return {
    playNote,
    playChord,
    playSequence
  } as NotePlayer;
}

function tonalChordToUsChord(tonalChord: string[]): ScoreChord {
  return [[tonalChord[0], 2].map(clampToUint7).concat([0])] as ScoreChord;
}

navigator.requestMIDIAccess().catch(console.log).then(midiAccess => {
  if (midiAccess) {
    midiAccess.outputs.forEach((port, key) => {
      const notePlayer = withPort(port);
      notePlayer.playChord(tonalChordToUsChord(Chord.notes("Asus4")), notePlayer);
    });
  }
});

ReactDOM.render(<p>Midi!</p>, document.getElementById('root'));
