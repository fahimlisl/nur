// Subscribe to this exact topic in the ntfy app to receive Nursitara's answer.
export const NTFY_TOPIC = "fahim-nursitara-a10e7fa9af339603"

const endpoint = `https://ntfy.sh/${NTFY_TOPIC}`

export function notifyFahim(message: string) {
  // Fire-and-forget so a network issue never interrupts her experience.
  void fetch(endpoint, {
    method: "POST",
    body: message,
    headers: {
      Title: "Nursitara answered",
      Priority: "high",
    },
    keepalive: true,
  }).catch(() => undefined)
}

export async function sendMessageToFahim(message: string, context: string) {
  const response = await fetch(endpoint, {
    method: "POST",
    body: `${message}\n\n— ${context}`,
    headers: {
      Title: "Message from Nursitara",
      Priority: "urgent",
    },
  })

  if (!response.ok) throw new Error("Message could not be sent")
}
