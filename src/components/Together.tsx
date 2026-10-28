import { useRef, type ReactNode } from "react"
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

const expectations = [
  ["we’ll be", "together"],
  ["we’ll learn each other", "together"],
  ["we’ll face everything", "together"],
  ["we’ll overcome", "together"],
  ["we’ll try to", "understand each other"],
]

const answers = [
  "learn you",
  "face everything",
  "overcome",
  "understand",
  "become Us",
]

function Scene({
  progress,
  range,
  children,
  className,
  last,
}: {
  progress: MotionValue<number>
  range: [number, number]
  children: ReactNode
  className?: string
  last?: boolean
}) {
  const [start, end] = range
  const fade = 0.035
  const input = last
    ? [start, start + fade]
    : [start, start + fade, end - fade, end]
  const opacity = useTransform(progress, input, last ? [0, 1] : [0, 1, 1, 0])
  const blur = useTransform(progress, input, last ? [18, 0] : [18, 0, 0, 18])
  const y = useTransform(progress, input, last ? [60, 0] : [60, 0, 0, -60])
  const scale = useTransform(
    progress,
    input,
    last ? [0.92, 1] : [0.92, 1, 1, 1.06],
  )
  const filter = useMotionTemplate`blur(${blur}px)`

  return (
    <motion.div
      className={`together-scene ${className ?? ""}`}
      style={{ opacity, y, scale, filter }}
    >
      {children}
    </motion.div>
  )
}

function ExpectationLine({
  progress,
  index,
  line,
}: {
  progress: MotionValue<number>
  index: number
  line: string[]
}) {
  const start = 0.17 + index * 0.06
  const opacity = useTransform(
    progress,
    [start - 0.03, start, start + 0.06],
    [0.12, 1, 0.32],
  )
  const x = useTransform(progress, [start - 0.03, start], [
    index % 2 ? 40 : -40,
    0,
  ])
  const lineWidth = useTransform(progress, [start - 0.02, start + 0.03], [0, 1])

  return (
    <motion.p className="expectation-line" style={{ opacity, x }}>
      <span>{line[0]}</span> <em>{line[1]}</em>
      <motion.i style={{ scaleX: lineWidth }} />
    </motion.p>
  )
}

export function Together() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const herX = useTransform(scrollYProgress, [0.08, 0.53], ["-34vw", "-0.6rem"])
  const himX = useTransform(scrollYProgress, [0.08, 0.53], ["34vw", "0.6rem"])
  const orbY = useTransform(scrollYProgress, [0, 0.53, 1], [
    "18svh",
    "0svh",
    "-8svh",
  ])
  const labelOpacity = useTransform(
    scrollYProgress,
    [0.06, 0.12, 0.46, 0.52],
    [0, 1, 1, 0],
  )
  const orbOpacity = useTransform(
    scrollYProgress,
    [0.03, 0.1, 0.92, 1],
    [0, 1, 1, 0.65],
  )
  const coreOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.56, 0.7, 1],
    [0, 1, 0.55, 0.85],
  )
  const coreScale = useTransform(
    scrollYProgress,
    [0.5, 0.58, 1],
    [0.2, 1.25, 1.7],
  )
  const flash = useTransform(scrollYProgress, [0.72, 0.755, 0.8], [0, 0.7, 0])
  const beam = useTransform(
    scrollYProgress,
    [0, 0.12, 0.85, 1],
    [0, 0.45, 0.45, 0.1],
  )
  const listY = useTransform(scrollYProgress, [0.13, 0.48], ["12%", "-12%"])
  const herLabel = useTransform(scrollYProgress, [0.68, 0.72], [1, 0])
  const myLabel = useTransform(scrollYProgress, [0.7, 0.74], [0, 1])

  return (
    <section
      className="together"
      ref={ref}
      aria-label="Nursitara's words and Fahim's answer"
    >
      <div className="together-sticky">
        <div className="fog fog-one" />
        <div className="fog fog-two" />
        <motion.div className="light-beam" style={{ opacity: beam }} />

        <div className="together-label">
          <motion.span style={{ opacity: herLabel }}>
            05 / her words
          </motion.span>
          <motion.span style={{ opacity: myLabel }}>06 / my answer</motion.span>
        </div>

        <motion.div
          className="orbs"
          style={{ y: orbY, opacity: orbOpacity }}
          aria-hidden="true"
        >
          <motion.div className="orb orb-her" style={{ x: herX }}>
            <motion.span style={{ opacity: labelOpacity }}>
              Nursitara
            </motion.span>
          </motion.div>
          <motion.div className="orb orb-him" style={{ x: himX }}>
            <motion.span style={{ opacity: labelOpacity }}>Fahim</motion.span>
          </motion.div>
          <motion.div
            className="orb-core"
            style={{ opacity: coreOpacity, scale: coreScale }}
          />
        </motion.div>

        <Scene
          progress={scrollYProgress}
          range={[0, 0.14]}
          className="scene-question"
        >
          <p className="eyebrow">and then, she asked me</p>
          <h2>
            “still you want
            <em>to stay with me?”</em>
          </h2>
          <p className="whisper">be honest… i won’t mind.</p>
        </Scene>

        <Scene
          progress={scrollYProgress}
          range={[0.13, 0.49]}
          className="scene-expectations"
        >
          <p className="eyebrow">I expected…</p>
          <motion.div className="expectation-list" style={{ y: listY }}>
            {expectations.map((line, index) => (
              <ExpectationLine
                key={line.join(" ")}
                progress={scrollYProgress}
                index={index}
                line={line}
              />
            ))}
          </motion.div>
        </Scene>

        <Scene
          progress={scrollYProgress}
          range={[0.48, 0.61]}
          className="scene-us"
        >
          <p>and we’ll become</p>
          <h2>Us</h2>
        </Scene>

        <Scene
          progress={scrollYProgress}
          range={[0.6, 0.72]}
          className="scene-bangla"
        >
          <p className="eyebrow">and yes, these were my expectations</p>
          <h2>“ami kichu sudhu amr jonno chaini…”</h2>
          <p className="whisper">
            i wanted all these things <strong>for Us.</strong>
          </p>
        </Scene>

        <Scene
          progress={scrollYProgress}
          range={[0.72, 0.85]}
          className="scene-yes"
        >
          <p className="eyebrow">you asked me to be honest. so, honestly:</p>
          <h2>Yes.</h2>
          <p>I want to stay. I want you. I want Us.</p>
        </Scene>

        <Scene
          progress={scrollYProgress}
          range={[0.84, 1]}
          className="scene-answer"
          last
        >
          <p className="eyebrow">every expectation you held—</p>
          <h2>
            I want it
            <em>too.</em>
          </h2>
          <div className="answer-chips">
            {answers.map((answer) => (
              <span key={answer}>
                <i />
                together, {answer}
              </span>
            ))}
          </div>
          <p className="answer-note">
            Not just for you. Not just for me. <strong>For Us</strong>—slowly,
            honestly, and together.
          </p>
        </Scene>

        <motion.div className="together-flash" style={{ opacity: flash }} />
      </div>
    </section>
  )
}
