import { useEffect, useRef } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react"
import { poem, promises, refusals } from "../content"
import { ease, HeartIcon, Reveal, ScrubText, Sparkle } from "./Effects"

export function Confession() {
  return (
    <section className="confession section-pad">
      <Reveal className="chapter">
        <span>01</span>
        <i />
        <span>the truth</span>
      </Reveal>
      <ScrubText
        className="confession-text"
        text="Yesterday, my words became a *storm,* and you were standing right where it landed. You did not deserve that. *Not* *even* *a* *little.*"
      />
      <div className="confession-foot">
        <Reveal>
          <p>No excuses. No “but.”</p>
        </Reveal>
        <Reveal delay={0.15}>
          <p>Just me, owning what I did—and how it made you feel.</p>
        </Reveal>
      </div>
    </section>
  )
}

function MarqueeRow({
  items,
  reverse,
  skew,
}: {
  items: string[]
  reverse?: boolean
  skew: MotionValue<number>
}) {
  const content = [...items, ...items]
  return (
    <motion.div
      className={`marquee-row ${reverse ? "is-reverse" : ""}`}
      style={{ skewX: skew }}
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
            {content.map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                <Sparkle />
              </span>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function VelocityMarquee() {
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 45, stiffness: 260 })
  const skew = useTransform(smooth, [-2200, 2200], [9, -9], { clamp: true })

  return (
    <section className="marquee" aria-label="I am sorry, Nursitara">
      <MarqueeRow
        skew={skew}
        items={["I’m sorry", "Nursitara", "I’m listening"]}
      />
      <MarqueeRow
        skew={skew}
        reverse
        items={["my words hurt you", "I see it now", "let me make it right"]}
      />
    </section>
  )
}

export function RedNos() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const distance = useRef(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })
  const x = useTransform(scrollYProgress, (value) => -value * distance.current)
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 24 })

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      distance.current = Math.max(
        0,
        trackRef.current.scrollWidth - window.innerWidth,
      )
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  return (
    <section className="red-nos" ref={sectionRef}>
      <div className="red-sticky">
        <div className="red-header">
          <span>02 / the weather</span>
          <motion.i style={{ scaleX: progress }} />
        </div>
        <motion.div className="red-track" ref={trackRef} style={{ x }}>
          <div className="red-intro">
            <p className="eyebrow">that day</p>
            <h2>
              everything I touched
              <em>came back refused.</em>
            </h2>
          </div>
          {refusals.map((item, index) => (
            <article className="refusal-card" key={item.stamp}>
              <span className="card-index">0{index + 1}</span>
              <motion.strong
                initial={{ opacity: 0, scale: 2.2, rotate: -18 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
                viewport={{ amount: 0.6 }}
                transition={{ type: "spring", stiffness: 180, damping: 13 }}
              >
                {item.stamp}
              </motion.strong>
              <p>{item.note}</p>
            </article>
          ))}
          <div className="red-outro">
            <p>and I walked into your voice</p>
            <h2>
              still wearing
              <em>them.</em>
            </h2>
            <span>That storm was never yours to catch.</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const heartPath =
  "M50 88 C20 66 4 50 4 28 C4 14 15 4 28 4 C38 4 46 10 50 18 C54 10 62 4 72 4 C85 4 96 14 96 28 C96 50 80 66 50 88Z"

function HeartHalf({
  side,
  x,
  rotate,
}: {
  side: "left" | "right"
  x: MotionValue<string>
  rotate: MotionValue<number>
}) {
  const points =
    side === "left"
      ? "0,0 52,0 47,18 55,32 46,48 54,62 47,76 50,92 0,92"
      : "52,0 100,0 100,92 50,92 47,76 54,62 46,48 55,32 47,18"

  return (
    <motion.svg
      className="heart-half"
      viewBox="0 0 100 92"
      style={{ x, rotate }}
    >
      <defs>
        <clipPath id={`heart-${side}`}>
          <polygon points={points} />
        </clipPath>
        <linearGradient
          id={`heart-gradient-${side}`}
          x1="0"
          x2="1"
          y1="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#f0b9ab" />
          <stop offset="55%" stopColor="#b85e59" />
          <stop offset="100%" stopColor="#5f2528" />
        </linearGradient>
      </defs>
      <path
        d={heartPath}
        clipPath={`url(#heart-${side})`}
        fill={`url(#heart-gradient-${side})`}
      />
    </motion.svg>
  )
}

export function MendingHeart() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const leftX = useTransform(scrollYProgress, [0, 0.62], ["-34%", "0%"])
  const rightX = useTransform(scrollYProgress, [0, 0.62], ["34%", "0%"])
  const leftRotate = useTransform(scrollYProgress, [0, 0.62], [-16, 0])
  const rightRotate = useTransform(scrollYProgress, [0, 0.62], [16, 0])
  const glow = useTransform(scrollYProgress, [0.55, 0.75], [0, 1])
  const glowScale = useTransform(scrollYProgress, [0.55, 0.85], [0.5, 1.25])
  const firstOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.38, 0.5],
    [0, 1, 1, 0],
  )
  const secondOpacity = useTransform(scrollYProgress, [0.58, 0.72], [0, 1])
  const secondY = useTransform(scrollYProgress, [0.58, 0.72], [40, 0])

  return (
    <section className="mending" ref={ref}>
      <div className="mending-sticky">
        <motion.div
          className="heart-glow"
          style={{ opacity: glow, scale: glowScale }}
        />
        <div className="heart-stage" aria-hidden="true">
          <HeartHalf side="left" x={leftX} rotate={leftRotate} />
          <HeartHalf side="right" x={rightX} rotate={rightRotate} />
        </div>
        <motion.p
          className="mending-line mending-first"
          style={{ opacity: firstOpacity }}
        >
          Some words break things
          <span>quietly.</span>
        </motion.p>
        <motion.p
          className="mending-line mending-second"
          style={{ opacity: secondOpacity, y: secondY }}
        >
          Let me spend my days
          <span>mending them.</span>
        </motion.p>
      </div>
    </section>
  )
}

export function Promises() {
  return (
    <section className="promises section-pad">
      <div className="promises-heading">
        <Reveal className="chapter light">
          <span>03</span>
          <i />
          <span>my promise</span>
        </Reveal>
        <ScrubText
          className="promises-title"
          text="I’m not asking you to *forget* the hurt. I’m asking for the chance to *earn* your trust again."
        />
      </div>
      <div className="promise-stack">
        {promises.map((promise, index) => (
          <motion.article
            className={`promise-card promise-${index}`}
            key={promise.number}
            initial={{ opacity: 0, y: 90, rotate: index % 2 ? 3 : -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 1.2 : -1.2 }}
            whileHover={{ rotate: 0, scale: 1.015 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1, ease }}
          >
            <span className="promise-number">{promise.number}</span>
            <div>
              <h3>{promise.title}</h3>
              <p>{promise.text}</p>
            </div>
            <HeartIcon />
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Stanza({ lines }: { lines: string[] }) {
  return (
    <motion.div
      className="stanza"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={{ show: { transition: { staggerChildren: 0.11 } } }}
    >
      {lines.map((line) => (
        <span className="line-mask" key={line}>
          <motion.span
            variants={{
              hidden: { y: "115%", rotate: 2.5 },
              show: {
                y: "0%",
                rotate: 0,
                transition: { duration: 1.05, ease },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}

export function Poem() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.65", "end 0.75"],
  })
  const pathLength = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["8%", "-38%"])

  return (
    <section className="poem-section" ref={ref}>
      <motion.div
        className="poem-watermark"
        style={{ x: watermarkX }}
        aria-hidden="true"
      >
        for the shore · for the shore ·
      </motion.div>
      <div className="poem-heading">
        <Reveal className="chapter">
          <span>04</span>
          <i />
          <span>my poem</span>
        </Reveal>
        <Reveal>
          <h2>
            what the wave
            <em>meant.</em>
          </h2>
        </Reveal>
        <svg className="tide-line" viewBox="0 0 80 600" aria-hidden="true">
          <path
            className="tide-base"
            d="M40 0 C5 75 75 150 40 225 S5 375 40 450 S75 525 40 600"
          />
          <motion.path
            d="M40 0 C5 75 75 150 40 225 S5 375 40 450 S75 525 40 600"
            style={{ pathLength }}
          />
        </svg>
      </div>
      <div className="poem-body" aria-label="A poem by Fahim for Nursitara">
        {poem.map((stanza) => (
          <Stanza lines={stanza} key={stanza[0]} />
        ))}
        <Reveal className="poem-sign">
          <span></span>
          <strong>🌻</strong>
        </Reveal>
      </div>
    </section>
  )
}
