import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Send, Mic, MicOff, Volume2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { dummyProfiles } from '../data/dummyProfiles'

export default function ChatPage() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { currentMatch, confirmMatch, setCurrentMatch } = useApp()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [matchConfirmed, setMatchConfirmed] = useState(false)
  const messagesEndRef = useRef()
  const recognitionRef = useRef(null)

  const match = currentMatch || dummyProfiles.find((p) => p.id === Number(matchId))

  useEffect(() => {
    if (!match) navigate('/swipe')
  }, [match, navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
    if (!text.trim()) return

    const userMsg = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          matchProfile: match,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      const fallbacks = [
        `That's really interesting! I'd love to hear more.`,
        `Haha I totally get that. So what do you do for fun?`,
        `Oh nice! That's so cool. I'm into ${match?.interests?.[0] || 'lots of things'} myself.`,
        `I feel like we vibe really well! What's your ideal date?`,
        `That's awesome. Tell me something nobody knows about you!`,
      ]
      const reply = fallbacks[messages.length % fallbacks.length]
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    }
    setIsTyping(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  function toggleRecording() {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      sendMessage(transcript)
      setIsRecording(false)
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  async function speakMessage(text) {
    // Try ElevenLabs backend first
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (data.audio_url) {
        const audio = new Audio(data.audio_url)
        audio.play()
        return
      }
    } catch {
      // Fall through to browser TTS
    }

    // Browser fallback TTS
    const utterance = new SpeechSynthesisUtterance(text)
    speechSynthesis.speak(utterance)
  }

  function handleMatch() {
    setMatchConfirmed(true)
    confirmMatch(match)
    // TODO: trigger hardware haptic heart via /api/haptic
    fetch('/api/haptic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'match' }),
    }).catch(() => {})
  }

  function handleNoMatch() {
    setCurrentMatch(null)
    navigate('/swipe')
  }

  if (!match) return null

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header__info">
          <div className="chat-header__avatar">{match.emoji || match.name?.[0]}</div>
          <div>
            <div className="chat-header__name">{match.name}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {match.pronouns} &middot; {match.zodiac}
            </div>
          </div>
        </div>
        <div className="chat-header__actions">
          {!matchConfirmed && (
            <>
              <button className="btn-match btn-match--yes" onClick={handleMatch}>
                Match
              </button>
              <button className="btn-match btn-match--no" onClick={handleNoMatch}>
                No Match
              </button>
            </>
          )}
        </div>
      </div>

      {matchConfirmed && (
        <div className="chat-match-confirmed">
          You confirmed a match with {match.name}! Keep the conversation going.
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 40 }}>
            Say hi to {match.name}! Send a text or voice message.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg chat-msg--${msg.role === 'user' ? 'user' : 'bot'}`}>
            {msg.content}
            <button
              className="chat-msg__speaker"
              onClick={() => speakMessage(msg.content)}
              aria-label="Read aloud"
              title="Read aloud"
            >
              <Volume2 size={14} />
            </button>
          </div>
        ))}
        {isTyping && (
          <div className="chat-typing">{match.name} is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <button
          type="button"
          className="btn-icon"
          onClick={toggleRecording}
          aria-label={isRecording ? 'Stop recording' : 'Record voice message'}
          title={isRecording ? 'Stop recording' : 'Record voice message'}
          style={isRecording ? { background: 'var(--color-error)', color: 'white' } : {}}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {isRecording ? (
          <div className="voice-recording">
            <span className="dot" />
            Recording... speak now
          </div>
        ) : (
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message input"
          />
        )}

        {!isRecording && (
          <button type="submit" className="btn-icon" aria-label="Send message" style={{ background: 'var(--color-primary)', color: 'white' }}>
            <Send size={20} />
          </button>
        )}
      </form>
    </div>
  )
}
