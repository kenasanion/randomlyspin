import { Entry } from '@/models/entry'
import { create } from 'zustand'

interface WheelSettings {
  entries: Entry[]
  setEntries: (entries: Entry[]) => void
  hideControls: boolean
  setHideControls: (hide: boolean) => void
  durationInSeconds: number
  distanceOfTextFromWheel: number
  wheelImage: HTMLImageElement | null
  spinDirection: 'clockwise' | 'counter-clockwise'
  audio: HTMLAudioElement | null
  setAudio: (audio: HTMLAudioElement | null) => void
  setWheelImage: (image: HTMLImageElement) => void
}

const useWheelSettings = create<WheelSettings>((set) => ({
  entries: [],
  setEntries: (entries: Entry[]) => set({ entries }),
  hideControls: false,
  setHideControls: (hide: boolean) => set({ hideControls: hide }),
  durationInSeconds: 10,
  distanceOfTextFromWheel: 0.6,
  wheelImage: null,
  spinDirection: 'clockwise',
  audio: null,
  setAudio: (audio?: HTMLAudioElement | null) => set({ audio }),
  setWheelImage: (image: HTMLImageElement) => set({ wheelImage: image }),
}))

export default useWheelSettings
