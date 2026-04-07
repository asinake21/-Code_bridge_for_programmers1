import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const QuizSystem = ({ courseId }) => {
  const [quiz, setQuiz] = useState({ questions: [] });
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  useEffect(() => {
    axios.get(`${API_URL}/quizzes/${courseId}`).then(res => {
      setQuiz(res.data);
    });
  }, [courseId]);

  const handleSelect = (qIdx, option) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIdx]: option });
  };

  const handleSubmit = async () => {
    let currentScore = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) currentScore++;
    });
    setScore(currentScore);
    setSubmitted(true);
    
    // Automatically flag as passed if score is > 0 (for standard edtech dummy run)
    if (currentScore > 0) {
      try {
        await axios.post(`${API_URL}/progress`, { courseId, updateType: 'quiz' });
        const stored = JSON.parse(localStorage.getItem('progress')) || {};
        stored[courseId] = 100;
        localStorage.setItem('progress', JSON.stringify(stored));
        window.dispatchEvent(new Event('storage')); // manually sync
      } catch(e) {
        console.error(e);
      }
    }
  };

  if (!quiz.questions.length) return <div className="p-10 text-center text-gray-500">{t.no_quiz}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      
      {submitted && (
        <div className={`mb-8 p-6 rounded-2xl border ${score === quiz.questions.length ? 'bg-green-50 border-green-200 text-green-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
           <h2 className="text-2xl font-bold flex items-center space-x-2">
              {score === quiz.questions.length ? <CheckCircle className="w-6 h-6 text-green-600" /> : <CheckCircle className="w-6 h-6 text-blue-600" />}
              <span>{t.quiz_completed}</span>
           </h2>
           <p className="mt-2 text-lg">{t.you_scored} <strong>{score}</strong> {t.out_of} <strong>{quiz.questions.length}</strong>.</p>
        </div>
      )}

      <div className="space-y-12">
        {quiz.questions.map((q, idx) => {
          const isCorrect = submitted && answers[idx] === q.answer;
          const isWrong = submitted && answers[idx] !== q.answer;
          
          return (
            <div key={idx} className="bg-white p-8 rounded-2xl border shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{idx + 1}. {q.question}</h3>
              <div className="space-y-3">
                {q.options.map(opt => {
                  const isSelected = answers[idx] === opt;
                  let optStyle = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
                  
                  if (submitted) {
                    if (opt === q.answer) optStyle = 'bg-green-100 border-green-500 text-green-900 border-2 font-bold';
                    else if (isSelected && isWrong) optStyle = 'bg-red-100 border-red-500 text-red-900 border-2';
                    else optStyle = 'border-gray-100 opacity-50';
                  } else if (isSelected) {
                    optStyle = 'border-blue-500 bg-blue-50 ring-2 ring-blue-200';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(idx, opt)}
                      disabled={submitted}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${optStyle}`}
                    >
                      <span className="text-lg">{opt}</span>
                      {submitted && opt === q.answer && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {submitted && isSelected && isWrong && <XCircle className="w-5 h-5 text-red-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="mt-10 text-center">
          <button 
             onClick={handleSubmit} 
             disabled={Object.keys(answers).length < quiz.questions.length}
             className="px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.submit_answers}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSystem;
