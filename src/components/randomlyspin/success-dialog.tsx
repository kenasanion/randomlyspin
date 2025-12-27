import { Entry } from '@/models/entry'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

interface SuccessDialogProps {
  winner?: Entry | null
  onClose: () => void
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ winner, onClose }) => {
  return (
    <Dialog open={!!winner} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            <span className="🎉 font-sans">We have a winner</span>
          </DialogTitle>
        </DialogHeader>
        <div className="text-5xl">{winner?.name}</div>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessDialog
