import { useState } from 'react'
import './App.css'
import StudentProfile from './StudentProfile'
import Achievements from './Achievements'
import DailyGoals from './DailyGoals'
import DailyStreak from './DailyStreak'
import WeeklyActivity from './WeeklyActivity'

const API_URL = 'http://localhost:5000'

function App() {
  // AI Tutor
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)

  // Quiz Generator
  const [quizTopic, setQuizTopic] = useState('')
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)
  const [quiz, setQuiz] = useState([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Study Planner
  const [subjects, setSubjects] = useState('')
  const [examDate, setExamDate] = useState('')
  const [dailyHours, setDailyHours] = useState(3)
  const [studyPlan, setStudyPlan] = useState('')
  const [planLoading, setPlanLoading] = useState(false)

  // Answer Evaluator
  const [evaluationQuestion, setEvaluationQuestion] = useState('')
  const [studentAnswer, setStudentAnswer] = useState('')
  const [totalMarks, setTotalMarks] = useState(10)
  const [evaluation, setEvaluation] = useState('')
  const [evaluationLoading, setEvaluationLoading] = useState(false)

  // Dashboard Statistics
  const [topicsExplored, setTopicsExplored] = useState(0)
  const [quizzesCompleted, setQuizzesCompleted] = useState(0)
  const [studyPlansCreated, setStudyPlansCreated] = useState(0)
  const [answersEvaluated, setAnswersEvaluated] = useState(0)
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0)
  const [totalQuizQuestions, setTotalQuizQuestions] = useState(0)

  const quizAccuracy = totalQuizQuestions === 0
    ? 0
    : Math.round((totalCorrectAnswers / totalQuizQuestions) * 100)

  // Common error message
  const [errorMessage, setErrorMessage] = useState('')

  // AI Topic Explainer
  const handleExplain = async () => {
    if (!topic.trim()) {
      setExplanation('Please enter a topic first.')
      return
    }

    setLoading(true)
    setExplanation('')
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Explanation failed.')
      }

      setExplanation(data.explanation || 'No explanation received.')
      setTopicsExplored((previous) => previous + 1)

    } catch (error) {
      console.error('AI Tutor Error:', error)
      setErrorMessage(error.message || 'Unable to connect to backend.')
    } finally {
      setLoading(false)
    }
  }

  // Clear AI Tutor
  const handleClear = () => {
    setTopic('')
    setExplanation('')
    setErrorMessage('')
  }

  // Quiz Generator
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) {
      setErrorMessage('Please enter a quiz topic.')
      return
    }

    setQuizLoading(true)
    setQuiz([])
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic.trim(),
          numberOfQuestions
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Quiz generation failed.')
      }

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No quiz questions were received.')
      }

      const validQuestions = data.questions.filter(
        (item) =>
          item &&
          typeof item.question === 'string' &&
          Array.isArray(item.options) &&
          item.options.length > 0 &&
          typeof item.answer === 'string'
      )

      if (validQuestions.length === 0) {
        throw new Error('The generated quiz has an invalid format.')
      }

      setQuiz(validQuestions)

    } catch (error) {
      console.error('Quiz Generator Error:', error)
      setErrorMessage(error.message || 'Unable to generate quiz.')
    } finally {
      setQuizLoading(false)
    }
  }

  // Select Quiz Answer
  const handleAnswerSelect = (questionIndex, option) => {
    if (quizSubmitted) return

    setSelectedAnswers((previous) => ({
      ...previous,
      [questionIndex]: option
    }))
  }

  // Calculate Score
  const score = quiz.reduce((total, question, index) => {
    return total + (
      selectedAnswers[index] === question.answer ? 1 : 0
    )
  }, 0)

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length !== quiz.length) {
      setErrorMessage('Please answer all questions before submitting.')
      return
    }

    setErrorMessage('')
    setQuizzesCompleted((previous) => previous + 1)
    setTotalCorrectAnswers((previous) => previous + score)
    setTotalQuizQuestions((previous) => previous + quiz.length)
    setQuizSubmitted(true)
  }

  // Retake Quiz
  const handleRetakeQuiz = () => {
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setErrorMessage('')
  }

  // Smart Study Planner
  const handleStudyPlan = async () => {
    if (!subjects.trim() || !examDate || !dailyHours) {
      setErrorMessage('Please fill in all study planner details.')
      return
    }

    setPlanLoading(true)
    setStudyPlan('')
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/api/study-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: subjects.trim(),
          examDate,
          dailyHours
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Study plan generation failed.')
      }

      setStudyPlan(data.studyPlan || 'No study plan received.')
      setStudyPlansCreated((previous) => previous + 1)

    } catch (error) {
      console.error('Study Planner Error:', error)
      setErrorMessage(error.message || 'Unable to generate study plan.')
    } finally {
      setPlanLoading(false)
    }
  }

  // AI Answer Evaluator
  const handleEvaluateAnswer = async () => {
    if (!evaluationQuestion.trim() || !studentAnswer.trim()) {
      setErrorMessage('Please enter both the question and your answer.')
      return
    }

    setEvaluationLoading(true)
    setEvaluation('')
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: evaluationQuestion.trim(),
          answer: studentAnswer.trim(),
          totalMarks
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Answer evaluation failed.')
      }

      setEvaluation(data.evaluation || 'No evaluation received.')
      setAnswersEvaluated((previous) => previous + 1)

    } catch (error) {
      console.error('Answer Evaluator Error:', error)
      setErrorMessage(error.message || 'Unable to evaluate your answer.')
    } finally {
      setEvaluationLoading(false)
    }
  }

  // Clear Answer Evaluator
  const handleClearEvaluation = () => {
    setEvaluationQuestion('')
    setStudentAnswer('')
    setTotalMarks(10)
    setEvaluation('')
    setErrorMessage('')
  }

  // Scroll to a section
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>🎓 StudyPilot AI</h2>

        <nav>
          <p onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Dashboard
          </p>

          <p onClick={() => scrollToSection('ai-tutor')}>
            AI Tutor
          </p>

          <p onClick={() => scrollToSection('quiz-generator')}>
            Quiz Generator
          </p>

          <p onClick={() => scrollToSection('study-planner')}>
            Study Planner
          </p>

          <p onClick={() => scrollToSection('answer-evaluator')}>
            Answer Evaluator
          </p>
          <p onClick={() => scrollToSection('student-profile')}>
  Student Profile
</p>

<p onClick={() => scrollToSection('daily-goals')}>
  Daily Goals
</p>

<p onClick={() => scrollToSection('weekly-activity')}>
  Weekly Activity
</p>

<p onClick={() => scrollToSection('daily-streak')}>
  Daily Streak
</p>

<p onClick={() => scrollToSection('achievements')}>
  Achievements
</p>
        </nav>

        <div className="profile">
          <h4>Student Account</h4>
          <span>Welcome, Student!</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
       <div id="student-profile">
      <StudentProfile/>
       </div>
       <div id="achievements">
        <Achievements
  topicsExplored={topicsExplored}
  quizzesCompleted={quizzesCompleted}
  studyPlansCreated={studyPlansCreated}
  answersEvaluated={answersEvaluated}
/>
</div>
<div id="daily-goals"></div>
<DailyGoals/>

<div id= "daily-streak">
  <DailyStreak/>
  </div>

<div id="weekly-activity">
  <WeeklyActivity/>
</div>

        {/* Header */}
        <header>
          <div>
            <h1>Welcome to StudyPilot AI 👋</h1>
            <p>Your personal AI-powered learning assistant.</p>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <h2>Learn Smarter, Not Harder.</h2>
          <p>
            Understand concepts, practice questions,
            and achieve your learning goals with AI.
          </p>

          <button onClick={() => scrollToSection('ai-tutor')}>
            Start Learning
          </button>
        </section>

        {/* Student Dashboard Statistics */}
        <section className="student-dashboard" id="dashboard">
          <h2>📊 Student Overview</h2>
          <p>Track your learning activity and progress.</p>

          <div className="features stats-grid">

            <div className="feature-card stat-card">
              <h3>📚 Topics Explored</h3>
              <h1>{topicsExplored}</h1>
              <p>AI topics explained</p>
            </div>

            <div className="feature-card stat-card">
              <h3>🧠 Quizzes Completed</h3>
              <h1>{quizzesCompleted}</h1>
              <p>Quizzes submitted</p>
            </div>

            <div className="feature-card stat-card">
              <h3>📅 Study Plans Created</h3>
              <h1>{studyPlansCreated}</h1>
              <p>Personalized plans generated</p>
            </div>

            <div className="feature-card stat-card">
              <h3>✍️ Answers Evaluated</h3>
              <h1>{answersEvaluated}</h1>
              <p>Answers checked by AI</p>
            </div>

          </div>

          <div className="ai-tutor accuracy-card">
            <h3>🎯 Quiz Accuracy</h3>

            <h1>{quizAccuracy}%</h1>

            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={quizAccuracy}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-fill"
                style={{ width: `${quizAccuracy}%` }}
              ></div>
            </div>

            <p>
              {totalCorrectAnswers} correct answers out of {totalQuizQuestions} questions.
            </p>
          </div>
        </section>

        {/* Error Message */}
        {errorMessage && (
          <div className="app-error" role="alert">
            {errorMessage}
            <button onClick={() => setErrorMessage('')}>
              ✕
            </button>
          </div>
        )}

        {/* AI Tutor */}
        <section className="ai-tutor" id="ai-tutor">
          <h2>🤖 AI Tutor</h2>
          <p>What would you like to learn today?</p>

          <input
            type="text"
            placeholder="Enter a topic, e.g. JavaScript"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="tutor-buttons">
            <button onClick={handleExplain} disabled={loading}>
              {loading ? 'Generating...' : 'Explain Topic'}
            </button>

            <button onClick={handleClear} disabled={loading}>
              Clear
            </button>
          </div>

          {explanation && (
            <div className="explanation">
              <h3>AI Explanation</h3>
              <p>{explanation}</p>
            </div>
          )}
        </section>

        {/* Quiz Generator */}
        <section className="ai-tutor quiz-section" id="quiz-generator">
          <h2>🧠 Quiz Generator</h2>
          <p>Test your knowledge with AI-generated questions.</p>

          <input
            type="text"
            placeholder="Enter a topic, e.g. React JS"
            value={quizTopic}
            onChange={(e) => setQuizTopic(e.target.value)}
            disabled={quizLoading}
          />

          <select
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            disabled={quizLoading}
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>

          <div className="tutor-buttons">
            <button
              onClick={handleGenerateQuiz}
              disabled={quizLoading}
            >
              {quizLoading ? 'Generating Quiz...' : 'Generate Quiz'}
            </button>
          </div>

          {quiz.length > 0 && (
            <div className="quiz-results">

              {quiz.map((item, index) => (
                <div className="explanation" key={index}>
                  <h3>
                    Q{index + 1}. {item.question}
                  </h3>

                  {item.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswers[index] === option
                    const isCorrect = item.answer.trim() === option.trim()

                    let className = 'quiz-option'

                    if (quizSubmitted && isCorrect) {
                      className += ' correct'
                    } else if (quizSubmitted && isSelected && !isCorrect) {
                      className += ' incorrect'
                    } else if (isSelected) {
                      className += ' selected'
                    }

                    return (
                      <button
                        type="button"
                        key={optionIndex}
                        className={className}
                        onClick={() => handleAnswerSelect(index, option)}
                        disabled={quizSubmitted}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                        {quizSubmitted && isCorrect && ' ✓'}
                        {quizSubmitted && isSelected && !isCorrect && ' ✗'}
                      </button>
                    )
                  })}

                  {quizSubmitted && (
                    <div className="answer-feedback">
                      <p>
                        <strong>Correct Answer:</strong> {item.answer}
                      </p>

                      {item.explanation && (
                        <p>{item.explanation}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  className="submit-quiz-button"
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="quiz-score">
                  <h2>🎉 Quiz Completed!</h2>

                  <h1>
                    {score} / {quiz.length}
                  </h1>

                  <p>
                    {score === quiz.length
                      ? 'Excellent! All answers are correct!'
                      : score >= quiz.length / 2
                      ? 'Good job! Keep practising!'
                      : 'Keep learning! You can improve!'}
                  </p>

                  <button onClick={handleRetakeQuiz}>
                    Retake Quiz
                  </button>

                  <button
                    onClick={handleGenerateQuiz}
                    disabled={quizLoading}
                  >
                    Generate New Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Smart Study Planner */}
        <section className="ai-tutor" id="study-planner">
          <h2>📅 Smart Study Planner</h2>
          <p>Create a study timetable based on your exam date.</p>

          <input
            type="text"
            placeholder="Enter subjects, e.g. Java, DBMS, Maths"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          />

          <label htmlFor="exam-date">Exam Date</label>
          <input
            id="exam-date"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />

          <label htmlFor="daily-hours">Daily study hours</label>
          <select
            id="daily-hours"
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hours) => (
              <option key={hours} value={hours}>
                {hours} {hours === 1 ? 'hour' : 'hours'}
              </option>
            ))}
          </select>

          <div className="tutor-buttons">
            <button
              onClick={handleStudyPlan}
              disabled={planLoading}
            >
              {planLoading ? 'Creating Study Plan...' : 'Create Study Plan'}
            </button>
          </div>

          {studyPlan && (
            <div className="explanation">
              <h3>Your Personalized Study Plan</h3>
              <p className="plan-text">{studyPlan}</p>
            </div>
          )}
        </section>

        {/* AI Answer Evaluator */}
        <section className="ai-tutor" id="answer-evaluator">
          <h2>✍️ AI Answer Evaluator</h2>
          <p>Submit your answer and get teacher-style feedback.</p>

          <label htmlFor="evaluation-question">
            Enter your question
          </label>

          <textarea
            id="evaluation-question"
            placeholder="Write your question here..."
            value={evaluationQuestion}
            onChange={(e) => setEvaluationQuestion(e.target.value)}
            disabled={evaluationLoading}
            rows={3}
          />

          <label htmlFor="student-answer">
            Write your answer
          </label>

          <textarea
            id="student-answer"
            placeholder="Write your answer here..."
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            disabled={evaluationLoading}
            rows={6}
          />

          <label htmlFor="total-marks">
            Maximum marks
          </label>

          <select
            id="total-marks"
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value))}
            disabled={evaluationLoading}
          >
            <option value={5}>5 Marks</option>
            <option value={10}>10 Marks</option>
            <option value={15}>15 Marks</option>
          </select>

          <div className="tutor-buttons">
            <button
              onClick={handleEvaluateAnswer}
              disabled={evaluationLoading}
            >
              {evaluationLoading ? 'Evaluating Answer...' : 'Evaluate Answer'}
            </button>

            <button
              onClick={handleClearEvaluation}
              disabled={evaluationLoading}
            >
              Clear
            </button>
          </div>

          {evaluation && (
            <div className="explanation">
              <h3>Your Answer Evaluation</h3>
              <p className="plan-text">{evaluation}</p>
            </div>
          )}
        </section>

        {/* Features */}
        <section className="features">
          <div className="feature-card">
            <h3>🤖 AI Tutor</h3>
            <p>Learn difficult concepts with simple AI explanations.</p>
          </div>

          <div className="feature-card">
            <h3>🧠 Quiz Generator</h3>
            <p>Practice with AI-generated questions and check your score.</p>
          </div>

          <div className="feature-card">
            <h3>📅 Smart Study Planner</h3>
            <p>Create a personalized timetable for your exams.</p>
          </div>

          <div className="feature-card">
            <h3>✍️ Answer Evaluator</h3>
            <p>Get feedback and marks for your written answers.</p>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <p>© 2026 StudyPilot AI. Learn Smarter, Not Harder.</p>
        </footer>

      </main>
    </div>
  )
}

export default App
        