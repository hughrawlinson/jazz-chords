enum EventCode {
  "NOTE_OFF" = 8,
  "NOTE_ON" = 9,
  "POLYPHONIC_KEY_PRESSURE" = 10,
  "CONTROL_CHANGE" = 11,
  "PROGRAM_CHANGE" = 12,
  "CHANNEL_PRESSURE" = 13,
  "PITCH_BEND_CHANGE" = 14
}

enum ChannelModeMessage {
  "ALL_SOUND_OFF" = 120,
  "RESET_ALL_CONTROLLERS" = 121,
  "LOCAL_CONTROL" = 122,
  "ALL_NOTES_OFF" = 123
}

export function clampToUint7(n: number): uint7 {
  const roundN = Math.floor(n);
  return roundN < 0 ? 0 : roundN > 127 ? 127 : roundN as uint7;
}

// Apparently I'm not kidding.
export type uint7 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127;

type ControllerNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119;

type uint4 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

type Channel = uint4;

export type KeyNumber = uint7;
export type Velocity = uint7;
type PressureValue = uint7;
type ControllerValue = uint7;
export type Duration = number;

type ControllerNumberOrChannelModeMessage = ControllerNumber | ChannelModeMessage;

export type MidiByteArray = number[];

interface MidiMessage {
  noteOn(k: KeyNumber, v: Velocity): MidiByteArray
  noteOff(k: KeyNumber, v: Velocity): MidiByteArray
  polyphonicKeyPressure(k: KeyNumber, p: PressureValue): MidiByteArray
  controlChange(c: ControllerNumberOrChannelModeMessage, v: ControllerValue): MidiByteArray
}

function makeNote(e: EventCode, c: Channel, k: uint7, y: uint7): number[] {
  return [e << 4 + c, k, y];
}

export function withChannel(channel: Channel): MidiMessage {
  const makeNoteWithChannel = (e: EventCode, k: uint7, y: uint7) => makeNote(e, channel, k, y);
  const makeNoteWithVelocityAndKeyNumber = (e: EventCode) => (k: KeyNumber, v: Velocity) => makeNoteWithChannel(e, k, v);
  const makeNoteWithVelocityAndPressureValue = (e: EventCode) => (k: KeyNumber, p: PressureValue) => makeNoteWithChannel(e, k, p);
  const makeNoteWithControllerNumberOrChannelModeMessageAndControllerValue = (e: EventCode) => (c: ControllerNumberOrChannelModeMessage, v: ControllerValue) => makeNoteWithChannel(e, c, v);

  return {
    noteOn: makeNoteWithVelocityAndKeyNumber(EventCode.NOTE_ON),
    noteOff: makeNoteWithVelocityAndKeyNumber(EventCode.NOTE_OFF),
    polyphonicKeyPressure: makeNoteWithVelocityAndPressureValue(EventCode.POLYPHONIC_KEY_PRESSURE),
    controlChange: makeNoteWithControllerNumberOrChannelModeMessageAndControllerValue(EventCode.CONTROL_CHANGE)
  }
}
