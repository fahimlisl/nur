import { useEffect, useRef, useState } from "react"
import { AnimatePresence, MotionConfig } from "motion/react"
import { CursorGlow, Petals, ScrollProgress } from "./components/Effects"
import { Finale } from "./components/Finale"
import { FinalChoice } from "./components/FinalChoice"
import { Hero } from "./components/Hero"
import { Intro } from "./components/Intro"
import {
  Confession,
  MendingHeart,
  Poem,
  Promises,
  RedNos,
  VelocityMarquee,
} from "./components/Scenes"
import { Together } from "./components/Together"
import { AmbientMusic } from "./lib/ambient"

export default function App() {
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const musicRef = useRef<AmbientMusic | null>(null)

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [opened])

  useEffect(() => () => musicRef.current?.dispose(), [])

  const setMusic = (enabled: boolean) => {
    musicRef.current ??= new AmbientMusic()
    if (enabled) musicRef.current.start()
    else musicRef.current.stop()
    setPlaying(enabled)
  }

  const openLetter = (withMusic: boolean) => {
    if (withMusic) setMusic(true)
    setOpened(true)
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {!opened && <Intro onOpen={openLetter} />}
      </AnimatePresence>
      <Petals />
      <CursorGlow />
      <ScrollProgress />
      <div className="grain" />

      <nav className="topbar" aria-label="Page controls">
        <div className="monogram" aria-label="Fahim and Nursitara">
          F <span>×</span> N
        </div>
        <button
          className={`sound-button ${playing ? "is-playing" : ""}`}
          onClick={() => setMusic(!playing)}
          aria-pressed={playing}
        >
          <span className="sound-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>{playing ? "music on" : "play music"}</span>
        </button>
      </nav>

      <main>
        <Hero ready={opened} />
        <Confession />
        <VelocityMarquee />
        <RedNos />
        <MendingHeart />
        <Promises />
        <Poem />
        <Together />
        <Finale />
        <FinalChoice />
      </main>
    </MotionConfig>
  )
}
