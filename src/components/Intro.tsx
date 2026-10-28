import { motion } from "motion/react"
import { ease, HeartIcon } from "./Effects"

const letters = "Nursitara".split("")

export function Intro({ onOpen }: { onOpen: (withMusic: boolean) => void }) {
  return (
    <motion.div
      className="intro"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 1.25, ease }}
    >
      <div className="intro-orbit intro-orbit-one" />
      <div className="intro-orbit intro-orbit-two" />
      <motion.div
        className="wax-seal"
        initial={{ scale: 0, rotate: -120 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 12,
          delay: 0.25,
        }}
      >
        <span>F</span>
        <HeartIcon />
      </motion.div>
      <motion.p
        className="eyebrow intro-eyebrow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.8 }}
      >
        a sealed letter for
      </motion.p>
      <div className="intro-name" aria-label="Nursitara">
        {letters.map((letter, index) => (
          <span
            className="letter-mask"
            key={`${letter}-${index}`}
            aria-hidden="true"
          >
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.7 + index * 0.055, duration: 1, ease }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </div>
      <motion.p
        className="intro-copy"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.45, duration: 1 }}
      >
        Read slowly. Every word here was meant only for you.
      </motion.p>
      <motion.div
        className="intro-actions"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.9, ease }}
      >
        <button className="primary-button" onClick={() => onOpen(true)}>
          <span>Open with music</span>
          <HeartIcon />
        </button>
        <button className="text-button" onClick={() => onOpen(false)}>
          open quietly
        </button>
      </motion.div>
    </motion.div>
  )
}
