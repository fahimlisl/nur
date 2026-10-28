import { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import us from "../assets/us.jpg"
import { notifyFahim } from "../lib/notify"
import { ease, HeartIcon, Reveal } from "./Effects"
import { MessageBox } from "./MessageBox"

type Choice = "stay" | "go" | null

function Burst() {
  return (
    <div className="burst" aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => {
        const angle = (index / 28) * Math.PI * 2
        const distance = 150 + (index % 4) * 55
        return (
          <motion.span
            key={index}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: [0, 1.4, 0.7],
              opacity: [1, 1, 0],
              rotate: index * 30,
            }}
            transition={{ duration: 2.2, delay: 0.75, ease: "easeOut" }}
          >
            <HeartIcon />
          </motion.span>
        )
      })}
    </div>
  )
}

function StayReveal() {
  return (
    <motion.div
      className="stay-reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="portrait-stage">
        <span className="portrait-ripple" />
        <span className="portrait-ripple ripple-delay" />
        <motion.div
          className="portrait-ring ring-dashed"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.7, ease }}
        />
        <motion.div
          className="portrait-ring ring-glow"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.25, ease }}
        />
        <motion.svg
          className="portrait-text"
          viewBox="0 0 300 300"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1, ease }}
          aria-hidden="true"
        >
          <defs>
            <path
              id="portrait-circle"
              d="M150,150 m-132,0 a132,132 0 1,1 264,0 a132,132 0 1,1 -264,0"
            />
          </defs>
          <text>
            <textPath
              href="#portrait-circle"
              textLength="826"
              lengthAdjust="spacing"
            >
              NURSITARA · FAHIM · US · ALWAYS · NURSITARA · FAHIM · US · ALWAYS
              ·
            </textPath>
          </text>
        </motion.svg>
        <motion.div
          className="portrait-frame"
          initial={{
            clipPath: "circle(0% at 50% 50%)",
            filter: "blur(18px) brightness(2.2)",
          }}
          animate={{
            clipPath: "circle(50% at 50% 50%)",
            filter: "blur(0px) brightness(1)",
          }}
          transition={{ duration: 1.9, delay: 0.45, ease }}
        >
          <motion.img
            src={us}
            alt="Fahim and Nursitara together"
            initial={{ scale: 1.6 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 3.2, delay: 0.45, ease }}
          />
        </motion.div>
        <div className="portrait-orbit" aria-hidden="true">
          <HeartIcon />
          <HeartIcon />
          <HeartIcon />
        </div>
        <Burst />
      </div>

      <motion.p
        className="eyebrow stay-eyebrow"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.9 }}
      >
        you chose Us
      </motion.p>
      <h2 className="stay-title" aria-label="Then come home. I’m right here.">
        {["Then come home.", "I’m right here."].map((line, index) => (
          <span className="line-mask" key={line} aria-hidden="true">
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 2 + index * 0.18, duration: 1.1, ease }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
      <motion.p
        className="stay-copy"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ delay: 2.6, duration: 1.1 }}
      >
        Thank you for choosing to stay. I’ll hold this second chance gently—with
        patience, honesty, and all the love I have, every single day.
      </motion.p>
      <MessageBox
        context="after choosing: Come to me"
        title="Anything you want to tell me?"
        delay={3}
      />
    </motion.div>
  )
}

function GoMessage({ onReturn }: { onReturn: () => void }) {
  return (
    <motion.div
      className="go-message"
      initial={{ opacity: 0, filter: "blur(16px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease }}
    >
      <div className="candle" aria-hidden="true">
        <span className="flame" />
        <span className="candle-glow" />
      </div>
      <p className="eyebrow">if you must go</p>
      <h2 aria-label="I’ll be missing you, every single day.">
        {["I’ll be missing you,", "every single day."].map((line, index) => (
          <span className="line-mask" key={line} aria-hidden="true">
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.5 + index * 0.2, duration: 1.2, ease }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
      <motion.p
        className="go-copy"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.2 }}
      >
        Take care of yourself, Nursitara. Be happy—just like this, just like you
        deserve. Whatever you choose, I’ll respect it, and I’ll always wish you
        nothing but light.
      </motion.p>
      <motion.div
        className="go-sign"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
      >
        — Fahim
      </motion.div>
      <MessageBox
        context="after choosing: I still want to go"
        title="If you want, leave me a few last words"
        delay={2.2}
      />
      <motion.button
        className="text-button go-return"
        onClick={onReturn}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
      >
        or… come back to me
      </motion.button>
    </motion.div>
  )
}

export function FinalChoice() {
  const ref = useRef<HTMLElement>(null)
  const [choice, setChoice] = useState<Choice>(null)

  const choose = (next: Exclude<Choice, null>, message: string) => {
    setChoice(next)
    notifyFahim(message)
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      className={`choice-section ${choice ? `is-${choice}` : ""}`}
      ref={ref}
    >
      <div className="choice-aura" aria-hidden="true" />
      <div className="choice-content">
        <AnimatePresence mode="wait">
          {choice === null && (
            <motion.div
              className="choice-ask"
              key="ask"
              exit={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
              transition={{ duration: 0.7, ease }}
            >
              <Reveal>
                <p className="eyebrow">one last question</p>
              </Reveal>
              <h2 aria-label="So, Nursitara, will you come back to me?">
                {["So, Nursitara…", "will you come", "back to me?"].map(
                  (line, index) => (
                    <span className="line-mask" key={line} aria-hidden="true">
                      <motion.span
                        initial={{ y: "115%" }}
                        whileInView={{ y: "0%" }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{
                          delay: index * 0.15,
                          duration: 1.15,
                          ease,
                        }}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ),
                )}
              </h2>
              <Reveal className="choice-actions" delay={0.35}>
                <button
                  className="choice-card choice-stay"
                  onClick={() => choose("stay", "She tapped: Come to me")}
                >
                  <HeartIcon />
                  <span>Come to me</span>
                  <small>I want to be Us</small>
                </button>
                <button
                  className="choice-card choice-go"
                  onClick={() => choose("go", "She tapped: I still want to go")}
                >
                  <span>I still want to go</span>
                  <small>I need to let go</small>
                </button>
              </Reveal>
              <MessageBox
                context="before choosing"
                title="Tell me what’s in your heart"
                collapsible
                delay={0.6}
              />
            </motion.div>
          )}
          {choice === "stay" && <StayReveal key="stay" />}
          {choice === "go" && (
            <GoMessage
              key="go"
              onReturn={() =>
                choose("stay", "She changed her mind: Come back to me")
              }
            />
          )}
        </AnimatePresence>
      </div>
      <footer>
        <span>made with remorse, hope, and all my heart</span>
        <span>F × N</span>
      </footer>
    </section>
  )
}
