import { useState, useRef, type MouseEvent } from 'react'

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
}

export function ImageZoom({ src, alt, className = '' }: ImageZoomProps) {
  const [zoom, setZoom] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
        className="w-full h-full object-cover transition-transform duration-200"
        style={{
          transform: zoom ? 'scale(2)' : 'scale(1)',
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      />
    </div>
  )
}
