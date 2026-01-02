'use client'

import useWheelSettings from '@/hooks/useWheelSettings'
import Link from 'next/link'

const Header = ({}) => {
  const { hideControls } = useWheelSettings()

  if (hideControls) return null

  return (
    <header className="flex flex-row justify-between gap-5 max-lg:flex-col lg:items-center">
      <div className="flex flex-col">
        <Link href="/">
          <h1 className="text-2xl font-bold">randomlyspin.com</h1>
        </Link>
      </div>

      {/* <div className="flex flex-row items-center gap-5">
        <h5 className="max-lg:hidden">select your mode 👉&nbsp;</h5>
        <Button
          className="h-10 w-10 rounded-full border-2 border-white bg-transparent"
          variant={'outline'}
        >
          <FerrisWheelIcon />
        </Button>

        <Button className="h-10 w-10 rounded-full" variant={'outline'}>
          <Disc3Icon />
        </Button>

        <Button className="h-10 w-10 rounded-full" variant={'outline'}>
          <PartyPopperIcon />
        </Button>
      </div> */}
    </header>
  )
}

export default Header
