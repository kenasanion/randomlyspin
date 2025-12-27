'use client'

import { Button } from '@/components/ui/button'
import useWheelSettings from '@/hooks/useWheelSettings'
import { CoffeeIcon, InfoIcon } from 'lucide-react'

const Footer = () => {
  const { hideControls } = useWheelSettings()

  if (hideControls) return null

  return (
    <footer
      className="flex flex-row items-center justify-between gap-5 pt-5 max-lg:flex-col"
      aria-label="Footer"
    >
      <p aria-label="Copyright" className="text-sm font-bold text-white">
        &copy; 2026 - Great Elf Archer™
      </p>
      <div className="flex flex-row gap-5">
        <Button className="font-bold" aria-label="Support Me">
          <CoffeeIcon aria-hidden="true" /> Support Me
        </Button>
        <Button className="font-bold" aria-label="About">
          <InfoIcon aria-hidden="true" /> About
        </Button>
      </div>
    </footer>
  )
}

export default Footer
