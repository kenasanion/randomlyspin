'use client'

import useWheelSettings from '@/hooks/useWheelSettings'
import { Entry } from '@/models/entry'
import { WheelStatus } from '@/models/wheel_status'
import { useCallback, useEffect, useRef, useState } from 'react'

interface BasicWheelProps {
  entries: Entry[]
  onChange?: (status: WheelStatus) => void
  onSuccess: (winner: Entry) => void
}

const BasicWheel: React.FC<BasicWheelProps> = ({ entries, onSuccess: onWinner, onChange }) => {
  const [windowWidth, setWindowWidth] = useState(0)

  const { audio } = useWheelSettings()

  // Main Wheel Properties
  const [radius, setRadius] = useState(0)
  const [rotation, setRotation] = useState(0) // State to manage rotation
  const [slices, setSlices] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const [winner, setWinner] = useState<Entry | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Custom Wheel Properties
  const { wheelImage, durationInSeconds, distanceOfTextFromWheel, spinDirection } =
    useWheelSettings()

  /**
   * Draws the image in the canvas.
   * @param c The rendering context of the canvas
   * @param img The image to draw
   * @param x The x-coordinate of the center of the image
   * @param y The y-coordinate of the center of the image
   * @param r The rotation of the image
   * @param size The size of the image
   */
  const drawImage = (
    c: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    r: number,
    size: number,
  ) => {
    c.save()
    c.globalCompositeOperation = 'destination-over'
    c.translate(x, y)
    c.rotate(-r * (Math.PI / 180))
    c.drawImage(img, -size / 2, -size / 2, size, size)
    c.restore()
  }

  const loadImage = (wheelImage: HTMLImageElement | null) => {
    if (!wheelImage) return

    const img = new Image()
    const canvas = canvasRef.current

    if (canvas && wheelImage) {
      const c = canvas.getContext('2d')!
      const imageSize = canvas.width * 1.1

      img.onload = () => {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        drawImage(c, img, centerX, centerY, rotation, imageSize)
      }
      img.src = wheelImage.src
    }
  }

  // Generate slice paths for the pizza
  const createWheel = (slices: number, wheelImage: HTMLImageElement | null) => {
    const canvas = canvasRef.current!
    const c = canvas.getContext('2d')!

    const radius = canvas.width / 2
    const sliceAngle = (2 * Math.PI) / slices

    // Clear previous drawing
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.translate(radius, radius)

    if (wheelImage) {
      drawImage(c, wheelImage, 0, 0, rotation, canvas.width * 1.1)
    }

    c.rotate(-rotation * (Math.PI / 180))
    // console.log(-rotation * (Math.PI / 180));

    // Draw sectors
    for (let i = 0; i < slices; i++) {
      const startAngle = i * sliceAngle - Math.PI / 2
      const endAngle = (i + 1) * sliceAngle - Math.PI / 2
      c.beginPath()
      c.moveTo(0, 0)
      c.arc(0, 0, radius, startAngle, endAngle)
      c.closePath()

      if (!wheelImage) {
        const color = `hsl(${(i / slices) * 360}, 90%, 60%)`
        c.fillStyle = color
        c.fill()
      }

      // Draw the name in the sector
      c.save()
      c.rotate((startAngle + endAngle) / 2)
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillStyle = 'white'
      c.font = 'bold 3em Arial'
      c.shadowOffsetX = 1
      c.shadowOffsetY = 1
      c.shadowBlur = 3
      c.fillText(entries[i].name, radius * distanceOfTextFromWheel, 0)
      c.restore()
    }

    c.rotate(rotation * (Math.PI / 180)) // Reset rotation
    c.translate(-radius, -radius)

    c.save()

    // Draw the wheel indicator
    c.translate(canvas.width / 2, 30)
    c.beginPath()
    c.moveTo(40 / 2, -40)
    c.lineTo(0, 0)
    c.lineTo(-40 / 2, -40)
    c.closePath()
    c.fillStyle = 'grey'
    c.fill()
    c.restore()
  }

  useEffect(() => {
    if (wheelImage) {
      console.log('Loading image', wheelImage)
      loadImage(wheelImage)
    }
  }, [wheelImage])

  const startSpin = () => {
    if (spinning) return
    setSpinning(true)
    audio?.play()

    // Set the number of full rotations and calculate final rotation
    // eslint-disable-next-line react-hooks/purity
    const numFullRotations = Math.random() * 5 + 5 // Between 5 and 10 full rotations
    const totalRotation = numFullRotations * 360
    const finalRotation =
      (rotation + (spinDirection === 'clockwise' ? -totalRotation : totalRotation)) % 360

    const spinDuration = 1000 * durationInSeconds
    const easing = (t: number) => {
      // Ease-out cubic
      return 1 - Math.pow(1 - t, 3)
    }

    let startTime: number

    const animate = (time: number) => {
      if (!startTime) startTime = time
      const elapsed = time - startTime
      const t = Math.min(elapsed / spinDuration, 1)
      const easeT = easing(t)
      const currentRotation =
        (rotation + (spinDirection === 'clockwise' ? -totalRotation : totalRotation)) * easeT

      setRotation(currentRotation)

      if (elapsed < spinDuration) {
        requestAnimationFrame(animate)
      } else {
        setSpinning(false)
        console.log('Final rotation:', currentRotation, finalRotation)
        const newWinner = determineWinner(entries, winner, finalRotation)

        if (newWinner) {
          onWinner(newWinner)
          audio?.pause()
          playAudio('/sound/congratulations.mp3', 0, 4)
        }
      }
    }

    requestAnimationFrame(animate)
  }

  const prevAngleRef = useRef<number>(null)
  const lastMoveRef = useRef<{ time: number; angle: number }[]>([])

  const getAngle = (x: number, y: number, centerX: number, centerY: number) => {
    return Math.atan2(y - centerY, x - centerX)
  }

  const playAudio = (path: string, time: number, until: number) => {
    const audio = new Audio(path) // Ensure the file is in the "public" folder

    // Start playback from 10s
    audio.currentTime = time
    audio.play()

    // Stop playback at 20s
    const stopPlayback = () => {
      if (audio.currentTime >= until) {
        audio.pause()
        audio.removeEventListener('timeupdate', stopPlayback)
      }
    }

    audio.addEventListener('timeupdate', stopPlayback)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    prevAngleRef.current = getAngle(e.clientX, e.clientY, centerX, centerY)
    lastMoveRef.current = [] // Reset movement history
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current || prevAngleRef.current === null) return
    const rect = canvasRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const currentAngle = getAngle(e.clientX, e.clientY, centerX, centerY)
    const currentTime = Date.now()

    const deltaAngle = (currentAngle - prevAngleRef.current) * (180 / Math.PI) // Convert to degrees
    setRotation((prev) => prev - deltaAngle)
    prevAngleRef.current = currentAngle

    // Store last movements (keep only recent 5 events for smoothing)
    lastMoveRef.current.push({
      time: currentTime,
      angle: rotation + deltaAngle,
    })
    if (lastMoveRef.current.length > 5) lastMoveRef.current.shift()
  }

  const handleMouseUp = () => {
    if (lastMoveRef.current.length > 1) {
      const first = lastMoveRef.current[0]
      const last = lastMoveRef.current[lastMoveRef.current.length - 1]
      const deltaTime = (last.time - first.time) / 1000 // Convert ms to seconds
      const deltaAngle = last.angle - first.angle
      const velocity = deltaAngle / deltaTime // Angular velocity (degrees/sec)
      console.log('Release force (angular velocity):', velocity.toFixed(2), 'deg/sec')
    }
    prevAngleRef.current = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const determineWinner = useCallback(
    (participants: Entry[], previousWinner: Entry | null | undefined, finalRotation: number) => {
      if (participants.length > 0) {
        const sliceAngle = 360 / participants.length
        const normalizedRotation = ((finalRotation % 360) + 360) % 360
        const winningSector = Math.floor(normalizedRotation / sliceAngle)
        console.log(previousWinner?.name, '->', participants[winningSector].name)

        if (previousWinner?.name !== participants[winningSector].name) {
          playAudio('/sound/spin.mp3', 1, 1.01)
          setWinner(participants[winningSector])
        }

        return participants[winningSector]
      }

      return undefined
    },
    [],
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    setWindowWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (windowWidth < 1024) {
      setRadius(windowWidth - 80)
    } else {
      let multiplier = 0.38
      if (windowWidth > 1920) multiplier = 0.4

      setRadius(windowWidth * multiplier) // Default radius for non-mobile
    }
  }, [windowWidth])

  // Update parent componment wi
  useEffect(() => {
    onChange?.({
      radius: radius,
      rotation: rotation,
      slices: slices,
      durationInSeconds: durationInSeconds,
      spinning: spinning,
      spinDirection: spinDirection,
    })
  }, [onChange, radius, rotation, slices, durationInSeconds, spinning, spinDirection])

  useEffect(() => {
    if (canvasRef.current) {
      setSlices(entries.length)
      createWheel(entries.length, wheelImage)

      determineWinner(entries, winner, rotation)
    }
  }, [entries, radius, rotation, winner, wheelImage, createWheel, determineWinner])

  return (
    <div className="flex flex-col items-center overflow-hidden select-none">
      <div aria-label="randomizer wheel" className="relative cursor-pointer p-5">
        <canvas
          ref={canvasRef}
          width={radius}
          height={radius}
          onClick={startSpin}
          onMouseDown={handleMouseDown}
          style={{ borderRadius: '50%', border: '2px solid black' }}
        />
      </div>
    </div>
  )
}

export default BasicWheel
