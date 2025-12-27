import { Entry } from '@/models/entry';
import { create } from 'zustand';

interface WheelSettings {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  durationInSeconds: number;
  distanceOfTextFromWheel: number;
  wheelImage: HTMLImageElement | null;
  spinDirection: 'clockwise' | 'counter-clockwise';
  setWheelImage: (image: HTMLImageElement) => void;
}

const useWheelSettings = create<WheelSettings>((set) => ({
  entries: [],
  setEntries: (entries: Entry[]) => set({ entries }),
  durationInSeconds: 5,
  distanceOfTextFromWheel: 0.6,
  wheelImage: null,
  spinDirection: 'clockwise',
  setWheelImage: (image: HTMLImageElement) => set({ wheelImage: image }),
}));

export default useWheelSettings;
