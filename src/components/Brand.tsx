import logoSrc from '../assets/elevated-cuts-logo.webp'

/** Fractions (0–1) of the source image that should stay visible. */
export interface Crop {
  x: number
  y: number
  w: number
  h: number
}

interface CroppedImageProps {
  src: string
  alt: string
  srcWidth: number
  srcHeight: number
  crop: Crop
  className?: string
  imgClassName?: string
  priority?: boolean
}

/**
 * Shows only the `crop` region of an image inside an aspect-ratio locked frame.
 * Used for brand artwork that ships with large baked-in margins.
 */
export function CroppedImage({
  src, alt, srcWidth, srcHeight, crop, className = '', imgClassName = '', priority = false,
}: CroppedImageProps) {
  const aspectRatio = (crop.w * srcWidth) / (crop.h * srcHeight)
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <img
        src={src}
        alt={alt}
        width={srcWidth}
        height={srcHeight}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`absolute max-w-none select-none ${imgClassName}`}
        style={{
          width: `${100 / crop.w}%`,
          left: `${(-crop.x / crop.w) * 100}%`,
          top: `${(-crop.y / crop.h) * 100}%`,
        }}
        draggable={false}
      />
    </div>
  )
}

const LOGO_CROP: Crop = { x: 0.19, y: 0.26, w: 0.62, h: 0.24 }

interface BrandLogoProps {
  className?: string
  /** Backdrop the logo's blend mode resolves against. Must match the parent surface. */
  surface?: 'canvas' | 'surface'
}

/**
 * The supplied logo is black artwork on white. In light mode it is multiplied onto the
 * surface (white drops out); in dark mode it is inverted and screened (black drops out).
 * The wrapper owns an explicit background so the blend never depends on ancestor layers.
 */
export function BrandLogo({ className = '', surface = 'canvas' }: BrandLogoProps) {
  const bg = surface === 'surface' ? 'bg-surface' : 'bg-canvas'
  return (
    <div className={`isolate ${bg} ${className}`}>
      <CroppedImage
        src={logoSrc}
        alt="Elevated Cuts"
        srcWidth={500}
        srcHeight={500}
        crop={LOGO_CROP}
        className="w-full"
        imgClassName="brand-logo-img"
        priority
      />
    </div>
  )
}
