import { useId, useState, type FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { sendMessageToFahim } from "../lib/notify"
import { ease, HeartIcon } from "./Effects"

const maxLength = 1000

type Status = "idle" | "sending" | "sent" | "error"

export function MessageBox({
  context,
  title,
  collapsible,
  delay = 0,
}: {
  context: string
  title: string
  collapsible?: boolean
  delay?: number
}) {
  const fieldId = useId()
  const [open, setOpen] = useState(!collapsible)
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = message.trim()
    if (!text || status === "sending") return

    setStatus("sending")
    try {
      await sendMessageToFahim(text, context)
      setStatus("sent")
      setMessage("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <motion.div
      className="message-box"
      initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 1, ease }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="toggle"
            className="message-toggle"
            onClick={() => setOpen(true)}
            exit={{ opacity: 0, y: -8 }}
          >
            <span />
            or tell me in your own words
            <span />
          </motion.button>
        ) : status === "sent" ? (
          <motion.div
            key="sent"
            className="message-sent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 16 }}
          >
            <HeartIcon />
            <p>Your words reached me.</p>
            <small>I’ll read every letter carefully.</small>
            <button className="text-button" onClick={() => setStatus("idle")}>
              write another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="message-form"
            onSubmit={submit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <label htmlFor={fieldId}>{title}</label>
            <textarea
              id={fieldId}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value)
                if (status === "error") setStatus("idle")
              }}
              maxLength={maxLength}
              rows={4}
              placeholder="Write anything you want me to know…"
            />
            <div className="message-footer">
              <span>
                {status === "error"
                  ? "It didn’t send. Please try once more."
                  : `${message.length}/${maxLength}`}
              </span>
              <button
                className="primary-button"
                type="submit"
                disabled={!message.trim() || status === "sending"}
              >
                <span>
                  {status === "sending" ? "Sending…" : "Send"}
                </span>
                {/* <HeartIcon /> */}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
