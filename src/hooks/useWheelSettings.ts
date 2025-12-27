import { Entry } from '@/models/entry'
import { create } from 'zustand'

interface WheelSettings {
  entries: Entry[]
  setEntries: (entries: Entry[]) => void
  hideControls: boolean
  setHideControls?: (hide: boolean) => void
  durationInSeconds: number
  distanceOfTextFromWheel: number
  wheelImage: HTMLImageElement | null
  spinDirection: 'clockwise' | 'counter-clockwise'
  setWheelImage: (image: HTMLImageElement) => void
}

const useWheelSettings = create<WheelSettings>((set) => ({
  entries: [],
  setEntries: (entries: Entry[]) => set({ entries }),
  hideControls: false,
  setHideControls: (hide: boolean) => set({ hideControls: hide }),
  durationInSeconds: 5,
  distanceOfTextFromWheel: 0.6,
  wheelImage: null,
  spinDirection: 'clockwise',
  setWheelImage: (image: HTMLImageElement) => set({ wheelImage: image }),
}))

export default useWheelSettings
