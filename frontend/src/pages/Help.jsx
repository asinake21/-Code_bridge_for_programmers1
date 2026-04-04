import { HelpCircle, Book, MessageSquare, Download } from 'lucide-react'
import { translations } from '../data/translations'
import { useLanguage } from '../context/LanguageContext'

function Help() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const faqs = [
    {
      icon: Book,
      question: t.help_q1,
      answer: t.help_a1
    },
    {
      icon: MessageSquare,
      question: t.help_q2,
      answer: t.help_a2
    },
    {
      icon: Download,
      question: t.help_q3,
      answer: t.help_a3
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-blue-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t.help}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t.helpText}
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => {
          const Icon = faq.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex gap-6 hover:shadow-md transition-shadow">
               <div className="flex-shrink-0 mt-1">
                 <div className="w-12 h-12 bg-blue-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center">
                   <Icon className="w-6 h-6 text-blue-600" />
                 </div>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
               </div>
            </div>
          )
        })}
      </div>

    </div>
  );
}

export default Help;
