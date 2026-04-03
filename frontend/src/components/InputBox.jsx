import { useState } from 'react'
import { Send, Mic } from 'lucide-react'

const InputBox = ({ onSendMessage }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about programming..."
          className="input w-full resize-none min-h-[44px] max-h-32 py-3 pr-12"
          rows={1}
          style={{ height: 'auto', minHeight: '44px' }}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
          }}
        />
        <button
          type="button"
          className="absolute right-3 bottom-3 p-1 rounded-lg hover:bg-surface/50 transition-colors"
        >
          <Mic className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
      <button
        type="submit"
        disabled={!message.trim()}
        className="btn-primary p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  )
}

export default InputBox