const chords = [
  [246.94, 293.66, 369.99, 493.88],
  [196, 246.94, 293.66, 392],
  [146.83, 220, 293.66, 369.99],
  [220, 277.18, 329.63, 440],
]

const pattern = [0, 2, 1, 3, 2, 1, 3, 2]

export class AmbientMusic {
  private context?: AudioContext
  private master?: GainNode
  private reverb?: ConvolverNode
  private timer?: number
  private step = 0

  start() {
    if (!this.context) this.setup()
    const context = this.context!
    void context.resume()
    this.master!.gain.cancelScheduledValues(context.currentTime)
    this.master!.gain.setTargetAtTime(0.22, context.currentTime, 0.8)

    if (!this.timer) {
      this.tick()
      this.timer = window.setInterval(() => this.tick(), 560)
    }
  }

  stop() {
    if (!this.context || !this.master) return
    this.master.gain.setTargetAtTime(0.0001, this.context.currentTime, 0.45)
    window.clearInterval(this.timer)
    this.timer = undefined
  }

  dispose() {
    this.stop()
    void this.context?.close()
  }

  private setup() {
    const context = new window.AudioContext()
    const master = context.createGain()
    const filter = context.createBiquadFilter()
    const reverb = context.createConvolver()
    const wet = context.createGain()

    master.gain.value = 0.0001
    filter.type = "lowpass"
    filter.frequency.value = 2600
    reverb.buffer = this.createImpulse(context)
    wet.gain.value = 0.55

    reverb.connect(wet)
    wet.connect(master)
    master.connect(filter)
    filter.connect(context.destination)

    this.context = context
    this.master = master
    this.reverb = reverb
  }

  private createImpulse(context: AudioContext) {
    const length = context.sampleRate * 3.2
    const impulse = context.createBuffer(2, length, context.sampleRate)
    for (let channel = 0; channel < 2; channel += 1) {
      const data = impulse.getChannelData(channel)
      for (let i = 0; i < length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6)
      }
    }
    return impulse
  }

  private note(
    frequency: number,
    velocity: number,
    duration: number,
    attack = 0.015,
  ) {
    if (!this.context || !this.master || !this.reverb) return
    const now = this.context.currentTime
    const envelope = this.context.createGain()
    const body = this.context.createOscillator()
    const shimmer = this.context.createOscillator()
    const shimmerGain = this.context.createGain()

    body.type = "sine"
    shimmer.type = "triangle"
    body.frequency.value = frequency
    shimmer.frequency.value = frequency * 2
    shimmerGain.gain.value = 0.12

    envelope.gain.setValueAtTime(0.0001, now)
    envelope.gain.exponentialRampToValueAtTime(velocity, now + attack)
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    body.connect(envelope)
    shimmer.connect(shimmerGain)
    shimmerGain.connect(envelope)
    envelope.connect(this.master)
    envelope.connect(this.reverb)

    body.start(now)
    shimmer.start(now)
    body.stop(now + duration + 0.1)
    shimmer.stop(now + duration + 0.1)
  }

  private tick() {
    const chord = chords[Math.floor(this.step / pattern.length) % chords.length]
    const index = pattern[this.step % pattern.length]

    if (this.step % pattern.length === 0) {
      this.note(chord[0] / 2, 0.11, 5.2, 1.2)
      this.note(chord[1], 0.035, 5.2, 1.8)
    }

    this.note(chord[index], this.step % 4 === 0 ? 0.065 : 0.042, 2.8)
    this.step += 1
  }
}
