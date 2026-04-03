import { ChevronRight, Lightbulb } from 'lucide-react'

const NoteCard = ({ note }) => {
  return (
    <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {note.topic}
          </span>
          <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">{note.title}</h3>
        <p className="text-text-secondary text-sm mb-4">{note.content}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-text mb-2">Code Example:</h4>
        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
          <code>{note.codeExample}</code>
        </pre>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text mb-2 flex items-center">
          <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
          Tips:
        </h4>
        <ul className="text-sm text-text-secondary space-y-1">
          {note.tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="text-primary mr-2">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NoteCard