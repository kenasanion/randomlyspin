import useWheelSettings from '@/hooks/useWheelSettings'
import { Entry } from '@/models/entry'
import { WheelStatus } from '@/models/wheel_status'
import { CircleUser, CodeIcon, MusicIcon, PaletteIcon, SettingsIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Textarea } from '../ui/textarea'
import MusicControl from './music-control'

interface SettingsTabProps {
  status?: WheelStatus | null
}

const SettingsTab = ({ status }: SettingsTabProps) => {
  const { entries, setEntries } = useWheelSettings()

  const [tab, setTab] = useState('create')
  const [quickTextEntry, setQuickTextEntry] = useState('Alex\nBob\nCharlie\nDavid\nEvan\nFrank')

  const onFileChange = (file: File) => {
    console.log('Music file changed:', file.name)
  }

  useEffect(() => {
    const processQuickChangeText = (text: string) => {
      const newEntries = text
        .split('\n')
        .filter((x) => x.trim().length > 0)
        .map((line) => new Entry(line))

      setEntries(newEntries)
      setQuickTextEntry(text)
    }

    processQuickChangeText(quickTextEntry)
  }, [quickTextEntry, setEntries])

  return (
    <div className="bg-opacity-10 rounded-lg bg-white p-5 shadow-lg backdrop-blur-lg backdrop-filter max-lg:w-full lg:w-[450px]">
      <Tabs defaultValue="create" onValueChange={(value) => setTab(value)}>
        <TabsList>
          <TabsTrigger value="create">
            <div className="flex flex-row items-center gap-2">
              <CircleUser />
              {tab === 'create' && <span>Setup</span>}
            </div>
          </TabsTrigger>
          <TabsTrigger value="music">
            <div className="flex flex-row items-center gap-2">
              <MusicIcon />
              {tab === 'music' && <span>Music</span>}
            </div>
          </TabsTrigger>
          <TabsTrigger value="theme">
            <div className="flex flex-row items-center gap-2">
              <PaletteIcon />
              {tab === 'theme' && <span>Settings</span>}
            </div>
          </TabsTrigger>
          <TabsTrigger value="settings">
            <div className="flex flex-row items-center gap-2">
              <SettingsIcon />
              {tab === 'settings' && <span>Settings</span>}
            </div>
          </TabsTrigger>
          <TabsTrigger value="status">
            <div className="flex flex-row items-center gap-2">
              <CodeIcon />
              {tab === 'status' && <span>Status</span>}
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card className="h-full rounded-tl-none border-none">
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>Add names and separate them by pressing Enter</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={quickTextEntry}
                onChange={(e) => setQuickTextEntry(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <pre
                className="w-full rounded-lg bg-gray-100 p-3 text-xs"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {JSON.stringify(status, null, 2)}
              </pre>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-xs font-bold">
                Total Entries: {entries.length}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="settings"></TabsContent>
        <TabsContent value="music">
          <Card className="h-full border-none">
            <CardHeader>Music</CardHeader>
            <CardContent>
              <MusicControl onFileChange={onFileChange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="theme"></TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsTab
