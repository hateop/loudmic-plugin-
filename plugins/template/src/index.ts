// src/index.ts
import React from "react";
import { SettingsPanel } from "./Settings";

// Define default settings for the plugin
let settings = {
  gain: 1.5,         // Mic volume boost multiplier
  delayTime: 0.25,   // Echo delay time in seconds
  eqFrequency: 1000, // Center frequency for EQ (Hz)
  eqGain: 3          // EQ boost in dB
};

let audioContext: AudioContext | null = null;
let stream: MediaStream | null = null;
let source: MediaStreamAudioSourceNode | null = null;
let gainNode: GainNode | null = null;
let delayNode: DelayNode | null = null;
let eqNode: BiquadFilterNode | null = null;

export const plugin = {
  info: {
    name: "LoudMicEnhancer",
    description:
      "Enhances microphone input with gain, echo, and equalization for a clear, loud voice.",
    version: "1.0.0",
    author: "YourName" // CHANGE HERE: Replace with your name
  },

  start() {
    // Create a new AudioContext
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Request microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((s) => {
        stream = s;
        source = audioContext!.createMediaStreamSource(stream);

        // Create a GainNode for volume boost
        gainNode = audioContext!.createGain();
        gainNode.gain.value = settings.gain; // Use current gain setting

        // Create a DelayNode for echo effect
        delayNode = audioContext!.createDelay();
        delayNode.delayTime.value = settings.delayTime; // Use current delay time

        // Create a BiquadFilterNode for equalization
        eqNode = audioContext!.createBiquadFilter();
        eqNode.type = "peaking";
        eqNode.frequency.value = settings.eqFrequency; // Use current EQ frequency
        eqNode.gain.value = settings.eqGain;           // Use current EQ gain

        // Chain the nodes: Source -> Gain -> Delay -> EQ -> Destination
        source.connect(gainNode);
        gainNode.connect(delayNode);
        delayNode.connect(eqNode);
        eqNode.connect(audioContext!.destination);
      })
      .catch((err) => console.error("Error accessing microphone:", err));
  },

  stop() {
    // Disconnect nodes and stop media stream
    if (source && gainNode && delayNode && eqNode) {
      source.disconnect();
      gainNode.disconnect();
      delayNode.disconnect();
      eqNode.disconnect();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
    audioContext = null;
    stream = null;
    source = null;
    gainNode = null;
    delayNode = null;
    eqNode = null;
  },

  getSettingsPanel() {
    // Return the settings panel component. When settings update,
    // restart the plugin to apply the changes.
    return (
      <SettingsPanel
        settings={settings}
        updateSettings={(newSettings) => {
          settings = newSettings;
          plugin.restart();
        }}
      />
    );
  },

  // Helper to restart the plugin (stop and start) to apply new settings
  restart() {
    this.stop();
    this.start();
  }
};
