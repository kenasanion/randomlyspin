'use client'

import SettingsTab from '@/components/randomlyspin/settings-tab'
import SuccessDialog from '@/components/randomlyspin/success-dialog'
import BasicWheel from '@/components/randomlyspin/wheel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'
import useWheelSettings from '@/hooks/useWheelSettings'
import { Entry } from '@/models/entry'
import { WheelStatus } from '@/models/wheel_status'
import confetti from 'canvas-confetti'
import { EyeIcon, EyeOffIcon, FerrisWheel } from 'lucide-react'
import { useState } from 'react'

export default function Page() {
  const [winner, setWinner] = useState<Entry | null>()
  const [status, setStatus] = useState<WheelStatus>()

  const [mode, setMode] = useState('default')

  const { entries, hideControls, setHideControls } = useWheelSettings()

  const handleWinner = (winner: Entry) => {
    setWinner(winner)

    confetti({
      particleCount: 300,
      spread: 100,
      startVelocity: 60,
      origin: { y: 0.6 },
    })
  }

  return (
    <>
      <SuccessDialog winner={winner} onClose={() => setWinner(null)} />
      <div className="flex flex-1 flex-col gap-5 lg:flex-row">
        <div className="relative flex flex-1 items-center justify-center drop-shadow-lg">
          <BasicWheel entries={entries} onSuccess={handleWinner} onChange={setStatus} />

          <div className="absolute top-0 left-0 z-999 flex flex-col gap-2">
            {!hideControls && (
              <>
                <div className="text-xs">
                  A lightweight random spinner for your needs. <br />
                  Select another spinner and bookmark it.
                </div>
                <div>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">
                        <FerrisWheel /> <span>Default</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Toggle
              aria-label="Toggle bookmark"
              pressed={hideControls}
              onPressedChange={setHideControls}
              variant="outline"
              className="w-fit data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
            >
              {hideControls ? (
                <>
                  <EyeOffIcon />
                </>
              ) : (
                <>
                  <EyeIcon /> <span>Show Controls</span>
                </>
              )}
            </Toggle>
          </div>
        </div>

        {!hideControls && <SettingsTab status={status} />}
      </div>
    </>
  )
}
