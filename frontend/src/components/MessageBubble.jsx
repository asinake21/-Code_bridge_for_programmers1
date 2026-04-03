import { Bot, User } from 'lucide-react'

const MessageBubble = ({ message }) => {
  const isAI = message.type === 'ai'

  return (
    <div className={`flex items-start space-x-3 ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAI ? 'bg-primary' : 'bg-secondary'
      }`}>
        {isAI ? (
          <Bot className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
        isAI ? '' : 'flex flex-col items-end'
      }`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isAI
            ? 'bg-surface text-text'
            : 'bg-primary text-white'
        }`}>
          <div className="prose prose-sm max-w-none">
            {message.content.split('\n').map((line, index) => {
              if (line.startsWith('```')) {
                const language = line.replace('```', '')
                return (
                  <pre key={index} className="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm">
                    <code>{language}</code>
                  </pre>
                )
              }
              return <p key={index} className="mb-2 last:mb-0">{line}</p>
            })}
          </div>
        </div>
        <span className="text-xs text-text-secondary mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

export default MessageBubble