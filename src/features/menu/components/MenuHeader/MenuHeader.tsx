import { useRef, useEffect } from 'react'
import { cn } from '@shared/utils/cn'
import { ChevronDown } from 'lucide-react'
import type { Tenant } from '@core/domain/entities/Tenant'

interface MenuHeaderProps {
  tenant: Tenant
  className?: string
}

export function MenuHeader({ tenant, className }: MenuHeaderProps) {
  const { branding } = tenant
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6 // Play slower but smooth
    }
  }, [])

  return (
    <header
      className={cn(
        'relative w-full aspect-[2/1] overflow-hidden bg-[#0B0B0C] rounded-b-[2rem] shadow-2xl border-b border-white/[0.04]',
        className
      )}
    >
      {/* Background Media */}
      {branding.coverImageUrl && (
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
          {/\.(mp4|webm|mov)/i.test(branding.coverImageUrl) ? (
            <video
              ref={videoRef}
              src={branding.coverImageUrl}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={branding.coverImageUrl}
              alt={tenant.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      )}

      {/* Bouncing Scroll Down Prompt (Desktop only) */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 text-white/80 select-none animate-bounce pointer-events-none">
        <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Deslizar
        </span>
        <ChevronDown size={18} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
      </div>
    </header>
  )
}
