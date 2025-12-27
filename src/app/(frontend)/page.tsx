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
import useWheelSettings from '@/hooks/useWheelSettings'
import { Entry } from '@/models/entry'
import { WheelStatus } from '@/models/wheel_status'
import confetti from 'canvas-confetti'
import { FerrisWheel } from 'lucide-react'
import { useState } from 'react'

export default function Page() {
  const [winner, setWinner] = useState<Entry | null>()
  const [status, setStatus] = useState<WheelStatus>()

  const [mode, setMode] = useState('default')

  const { entries } = useWheelSettings()

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
      <div className="flex flex-1 flex-col gap-5 px-8 lg:flex-row">
        <div className="relative flex flex-1 items-center justify-center drop-shadow-lg">
          <BasicWheel entries={entries} onSuccess={handleWinner} onChange={setStatus} />
          <div className="absolute top-0 left-0 z-999">
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <FerrisWheel /> <span>Default</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SettingsTab status={status} />
      </div>
    </>
  )
}
