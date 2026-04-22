import { useState, useRef, useEffect } from 'react'
import type { Offer } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface Props { offer: Offer; onClose: () => void }

export default function ScratchCardPreview({ offer, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [isScratching, setIsScratching] = useState(false)
  const scratched = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#c026d3'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#a21caf'
    ctx.font = 'bold 16px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('✨ Scratch to reveal your gift!', canvas.width / 2, canvas.height / 2 - 8)
    ctx.font = '12px Inter, sans-serif'
    ctx.fillStyle = '#e879f9'
    ctx.fillText('Use your finger or mouse', canvas.width / 2, canvas.height / 2 + 14)

    scratched.current = 0
    setRevealed(false)
  }, [offer])

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getPos(e, canvas)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 22, 0, Math.PI * 2)
    ctx.fill()

    scratched.current += 1
    if (scratched.current > 25 && !revealed) setRevealed(true)
  }

  return (
    <Modal open onClose={onClose} title="Scratch Card Preview" size="sm">
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">This is how the scratch card appears to patients:</p>

        <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-purple-50 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-4xl mb-2">🎁</p>
              <p className="text-lg font-bold text-brand-700">{offer.scratchRevealValue ?? '25% OFF'}</p>
              <p className="text-xs text-brand-500 mt-1">Valid for 7 days from reveal</p>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={340} height={192}
            className="absolute inset-0 cursor-pointer touch-none select-none rounded-2xl"
            onMouseDown={() => setIsScratching(true)}
            onMouseUp={() => setIsScratching(false)}
            onMouseLeave={() => setIsScratching(false)}
            onMouseMove={scratch}
            onTouchStart={() => setIsScratching(true)}
            onTouchEnd={() => setIsScratching(false)}
            onTouchMove={scratch}
          />
        </div>

        {revealed && (
          <p className="text-sm font-semibold text-green-600 animate-bounce">Revealed! 🎉 Gift unlocked.</p>
        )}

        {/* Voice message preview */}
        {offer.voiceMessageUrl && (
          <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
            <p className="text-xs font-semibold text-brand-700 mb-2">🎤 Personalised Voice Note</p>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">▶</button>
              <div className="flex-1 h-1.5 bg-brand-200 rounded-full">
                <div className="h-1.5 w-1/3 bg-brand-500 rounded-full" />
              </div>
              <span className="text-xs text-brand-500">0:12</span>
            </div>
          </div>
        )}

        <Button variant="secondary" fullWidth onClick={onClose}>Close Preview</Button>
      </div>
    </Modal>
  )
}
