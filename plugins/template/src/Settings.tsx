// src/Settings.tsx
import React, { useState } from "react";

type SettingsType = {
  gain: number;
  delayTime: number;
  eqFrequency: number;
  eqGain: number;
};

type SettingsProps = {
  settings: SettingsType;
  updateSettings: (newSettings: SettingsType) => void;
};

export function SettingsPanel({ settings, updateSettings }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);

  const onChange = (key: keyof SettingsType, value: number) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  return (
    <div style={{ padding: "10px" }}>
      <h3>LoudMicEnhancer Settings</h3>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Gain: {localSettings.gain.toFixed(1)}
          <br />
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={localSettings.gain}
            onChange={(e) => onChange("gain", parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Delay Time (sec): {localSettings.delayTime.toFixed(2)}
          <br />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={localSettings.delayTime}
            onChange={(e) => onChange("delayTime", parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          EQ Frequency (Hz): {localSettings.eqFrequency}
          <br />
          <input
            type="range"
            min="100"
            max="5000"
            step="50"
            value={localSettings.eqFrequency}
            onChange={(e) => onChange("eqFrequency", parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          EQ Gain (dB): {localSettings.eqGain}
          <br />
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={localSettings.eqGain}
            onChange={(e) => onChange("eqGain", parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
