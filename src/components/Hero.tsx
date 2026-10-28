import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { ease, HeartIcon } from "./Effects"

const name = "NURSITARA".split("")

function Waves() {
  return (
    <div className="waves" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <svg
          className={`wave wave-${index}`}
          key={index}
          viewBox="0 0 2880 140"
          preserveAspectRatio="none"
        >
          <path d="M0 70 Q180 25 360 70 T720 70 T1080 70 T1440 70 T1800 70 T2160 70 T2520 70 T2880 70 V140 H0Z" />
        </svg>
      ))}
    </div>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.42])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "62%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0])
  const moonY = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"])
  const badgeRotate = useTransform(scrollYProgress, [0, 1], [0, 220])

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero-photo" style={{ scale: photoScale }} />
      <div className="hero-vignette" />
      <motion.div
        className="hero-moon"
        style={{ y: moonY }}
        initial={{ opacity: 0, scale: 0.55 }}
        animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 2.4, ease }}
      />
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <i key={index} />
        ))}
      </div>

      <motion.div
        className="hero-content"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="eyebrow hero-eyebrow"
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={ready ? { opacity: 1, letterSpacing: "0.28em" } : undefined}
          transition={{ duration: 1.6, ease }}
        >
          Fahim’s apology, written for
        </motion.p>
        <h1 className="hero-name" aria-label="Nursitara">
          {name.map((letter, index) => (
            <span
              className="letter-mask"
              key={`${letter}-${index}`}
              aria-hidden="true"
            >
              <motion.span
                initial={{ y: "118%", rotate: 10 }}
                animate={ready ? { y: "0%", rotate: 0 } : undefined}
                transition={{
                  delay: 0.25 + index * 0.075,
                  duration: 1.15,
                  ease,
                }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className="hero-script"
          initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
          animate={
            ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
          }
          transition={{ delay: 1.05, duration: 1.4, ease }}
        >
          i’m truly sorry, my love
        </motion.p>
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ delay: 1.55, duration: 1.2 }}
        >
          Not to make the hurt disappear.
          <br />
          To finally hold it honestly.
        </motion.p>
      </motion.div>

      <motion.div
        className="sorry-badge"
        style={{ rotate: badgeRotate }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200">
          <defs>
            <path
              id="badge-circle"
              d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"
            />
          </defs>
          <text>
            <textPath
              href="#badge-circle"
              textLength="476"
              lengthAdjust="spacing"
            >
              I’M SORRY · I’M LISTENING · I’M HERE · ALWAYS ·
            </textPath>
          </text>
        </svg>
        <HeartIcon />
      </motion.div>

      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 2.1 }}
      >
        <span>scroll gently</span>
        <i />
      </motion.div>
      <Waves />
    </section>
  )
}
