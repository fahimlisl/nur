import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { ease, Reveal } from "./Effects"

export function Finale() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  })
  const moonY = useTransform(scrollYProgress, [0, 1], ["55%", "0%"])
  const moonScale = useTransform(scrollYProgress, [0, 1], [0.65, 1])

  return (
    <section className="finale" ref={ref}>
      <motion.div
        className="finale-moon"
        style={{ y: moonY, scale: moonScale }}
      />
      <div className="stars finale-stars" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="finale-content">
        <Reveal>
          <p className="eyebrow">Nursitara,</p>
        </Reveal>
        <h2 aria-label="I love you more carefully than I spoke.">
          {["I love you", "more carefully", "than I spoke."].map(
            (line, index) => (
              <span className="line-mask" key={line} aria-hidden="true">
                <motion.span
                  initial={{ y: "110%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ delay: index * 0.14, duration: 1.15, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ),
          )}
        </h2>
        <Reveal className="finale-copy" delay={0.2}>
          <p>
            I’m not here to rush your heart. I only hope you’ll let me
            listen—and let me show you, through my actions, how much you mean to
            me.
          </p>
        </Reveal>
        <Reveal className="signature" delay={0.2}>
          <span>always, only, truly yours</span>
          <strong>Fahim</strong>
        </Reveal>
      </div>
    </section>
  )
}
