var EventCode;
(function (EventCode) {
    EventCode[EventCode["NOTE_OFF"] = 8] = "NOTE_OFF";
    EventCode[EventCode["NOTE_ON"] = 9] = "NOTE_ON";
    EventCode[EventCode["POLYPHONIC_KEY_PRESSURE"] = 10] = "POLYPHONIC_KEY_PRESSURE";
    EventCode[EventCode["CONTROL_CHANGE"] = 11] = "CONTROL_CHANGE";
    EventCode[EventCode["PROGRAM_CHANGE"] = 12] = "PROGRAM_CHANGE";
    EventCode[EventCode["CHANNEL_PRESSURE"] = 13] = "CHANNEL_PRESSURE";
    EventCode[EventCode["PITCH_BEND_CHANGE"] = 14] = "PITCH_BEND_CHANGE";
})(EventCode || (EventCode = {}));
var ChannelModeMessage;
(function (ChannelModeMessage) {
    ChannelModeMessage[ChannelModeMessage["ALL_SOUND_OFF"] = 120] = "ALL_SOUND_OFF";
    ChannelModeMessage[ChannelModeMessage["RESET_ALL_CONTROLLERS"] = 121] = "RESET_ALL_CONTROLLERS";
    ChannelModeMessage[ChannelModeMessage["LOCAL_CONTROL"] = 122] = "LOCAL_CONTROL";
    ChannelModeMessage[ChannelModeMessage["ALL_NOTES_OFF"] = 123] = "ALL_NOTES_OFF";
})(ChannelModeMessage || (ChannelModeMessage = {}));
export function clampToUint7(n) {
    return n < 0 ? 0 : n > 127 ? 127 : n;
}
function makeNote(e, c, k, y) {
    return [e << 4 + c, k, y];
}
export function withChannel(channel) {
    var makeNoteWithChannel = function (e, k, y) { return makeNote(e, channel, k, y); };
    var makeNoteWithVelocityAndKeyNumber = function (e) { return function (k, v) { return makeNoteWithChannel(e, k, v); }; };
    var makeNoteWithVelocityAndPressureValue = function (e) { return function (k, p) { return makeNoteWithChannel(e, k, p); }; };
    var makeNoteWithControllerNumberOrChannelModeMessageAndControllerValue = function (e) { return function (c, v) { return makeNoteWithChannel(e, c, v); }; };
    return {
        noteOn: makeNoteWithVelocityAndKeyNumber(EventCode.NOTE_ON),
        noteOff: makeNoteWithVelocityAndKeyNumber(EventCode.NOTE_OFF),
        polyphonicKeyPressure: makeNoteWithVelocityAndPressureValue(EventCode.POLYPHONIC_KEY_PRESSURE),
        controlChange: makeNoteWithControllerNumberOrChannelModeMessageAndControllerValue(EventCode.CONTROL_CHANGE)
    };
}
//# sourceMappingURL=index.js.map