import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

export const ease = [0.16, 1, 0.3, 1] as const

export function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.5S3.5 15.4 3.5 8.9A4.4 4.4 0 0 1 12 6.8a4.4 4.4 0 0 1 8.5 2.1c0 6.5-8.5 11.6-8.5 11.6Z" />
    </svg>
  )
}

export function Sparkle() {
  return (
    <svg className="sparkle" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1c.8 6 3.2 9.2 11 11-7.8 1.8-10.2 5-11 11-.8-6-3.2-9.2-11-11 7.8-1.8 10.2-5 11-11Z" />
    </svg>
  )
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function ScrubWord({
  word,
  progress,
  range,
}: {
  word: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.1, 1])
  const y = useTransform(progress, range, [14, 0])
  const accent = word.startsWith("*")

  return (
    <span className="scrub-word">
      <motion.span
        className={accent ? "accent-word" : undefined}
        style={{ opacity, y }}
      >
        {word.replace(/\*/g, "")}
      </motion.span>
    </span>
  )
}

export function ScrubText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "end 0.42"],
  })
  const words = text.split(" ")

  return (
    <p ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
      {words.map((word, index) => (
        <ScrubWord
          key={`${word}-${index}`}
          word={word}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1) / words.length]}
        />
      ))}
    </p>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

export function CursorGlow() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 260, damping: 28 })
  const ringY = useSpring(y, { stiffness: 260, damping: 28 })
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    setEnabled(true)
    const move = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setActive(Boolean((event.target as HTMLElement).closest("button")))
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: active ? 2.3 : 1 }}
      />
      <motion.div className="cursor-dot" style={{ x, y }} />
    </>
  )
}

type Petal = {
  x: number
  y: number
  size: number
  speed: number
  sway: number
  swaySpeed: number
  rotation: number
  spin: number
  alpha: number
}

export function Petals() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext("2d")
    if (
      !canvas ||
      !context ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    let width = 0
    let height = 0
    let frame = 0
    const ratio = Math.min(window.devicePixelRatio, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const createPetal = (initial: boolean): Petal => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : -30,
      size: 4 + Math.random() * 8,
      speed: 0.35 + Math.random() * 0.75,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.006 + Math.random() * 0.012,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.025,
      alpha: 0.25 + Math.random() * 0.45,
    })

    resize()
    const petals = Array.from({ length: width < 700 ? 16 : 32 }, () =>
      createPetal(true),
    )

    const draw = () => {
      context.clearRect(0, 0, width, height)
      petals.forEach((petal, index) => {
        petal.y += petal.speed
        petal.sway += petal.swaySpeed
        petal.rotation += petal.spin
        petal.x += Math.sin(petal.sway) * 0.45
        if (petal.y > height + 30) petals[index] = createPetal(false)

        context.save()
        context.translate(petal.x, petal.y)
        context.rotate(petal.rotation)
        context.globalAlpha = petal.alpha
        const gradient = context.createLinearGradient(
          -petal.size,
          0,
          petal.size,
          0,
        )
        gradient.addColorStop(0, "#f2c5b9")
        gradient.addColorStop(1, "#a95f5b")
        context.fillStyle = gradient
        context.beginPath()
        context.ellipse(0, 0, petal.size, petal.size * 0.52, 0, 0, Math.PI * 2)
        context.fill()
        context.restore()
      })
      frame = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas className="petals" ref={ref} aria-hidden="true" />
}
