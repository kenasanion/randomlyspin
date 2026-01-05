import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import useWheelSettings from '@/hooks/useWheelSettings'
import { Pause, Play, Upload, Volume2, VolumeX } from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

interface MusicControlProps {
  onFileChange?: (file: File) => void
}

const MusicControl: React.FC<MusicControlProps> = ({ onFileChange }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>('')

  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { setAudio } = useWheelSettings()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = (): void => setCurrentTime(audio.currentTime)
    const updateDuration = (): void => setDuration(audio.duration)
    const handleEnded = (): void => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file)
      if (audioRef.current) {
        audioRef.current.src = url
      }
      setFileName(file.name)
      setIsPlaying(false)
      setCurrentTime(0)

      if (onFileChange) {
        onFileChange(file)
        setAudio(audioRef.current)
      }
    }
  }

  const togglePlay = (): void => {
    if (!audioRef.current?.src) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]): void => {
    const time = value[0]
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (value: number[]): void => {
    const vol = value[0]
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
    setIsMuted(vol === 0)
  }

  const toggleMute = (): void => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg">
      <audio ref={audioRef} />

      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Music Control</h2>
        {fileName && <p className="truncate text-sm text-gray-600">{fileName}</p>}
      </div>

      <div className="flex justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Upload Audio File
        </Button>
      </div>

      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
          disabled={!fileName}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={togglePlay}
          size="lg"
          className="h-14 w-14 rounded-full"
          disabled={!fileName}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={toggleMute} variant="ghost" size="sm" disabled={!fileName}>
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-full"
          disabled={!fileName}
        />
      </div>
    </div>
  )
}

export default MusicControl
