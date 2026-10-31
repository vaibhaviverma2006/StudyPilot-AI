import { useState, useEffect } from 'react'

function DailyStreak() {
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [studyDays, setStudyDays] = useState(0)

  // Load saved streak
  useEffect(() => {
    const savedStreak = localStorage.getItem('dailyStudyStreak')

    if (savedStreak) {
      const streakData = JSON.parse(savedStreak)

      setCurrentStreak(streakData.currentStreak)
      setLongestStreak(streakData.longestStreak)
      setStudyDays(streakData.studyDays)
    }
  }, [])

  // Save streak
  const saveStreak = () => {
    const streakData = {
      currentStreak,
      longestStreak,
      studyDays
    }

    localStorage.setItem(
      'dailyStudyStreak',
      JSON.stringify(streakData)
    )
  }

  // Mark today's study
  const markTodayStudied = () => {
    const today = new Date().toDateString()
    const lastStudyDate = localStorage.getItem('lastStudyDate')

    if (lastStudyDate === today) {
      alert('You have already marked today as studied! 😊')
      return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const newCurrentStreak =
      lastStudyDate === yesterday.toDateString()
        ? currentStreak + 1
        : 1

    const newLongestStreak = Math.max(
      longestStreak,
      newCurrentStreak
    )

    const newStudyDays = studyDays + 1

    setCurrentStreak(newCurrentStreak)
    setLongestStreak(newLongestStreak)
    setStudyDays(newStudyDays)

    localStorage.setItem('lastStudyDate', today)

    localStorage.setItem(
      'dailyStudyStreak',
      JSON.stringify({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        studyDays: newStudyDays
      })
    )
  }

  return (
    <div className="daily-streak">
      <h2>🔥 Daily Study Streak</h2>

      <p>Build a daily study habit and keep your streak alive!</p>

      <div className="streak-stats">
        <div>
          <h3>🔥 {currentStreak}</h3>
          <p>Current Streak</p>
        </div>

        <div>
          <h3>🏆 {longestStreak}</h3>
          <p>Longest Streak</p>
        </div>

        <div>
          <h3>📅 {studyDays}</h3>
          <p>Days Studied</p>
        </div>
      </div>

      <button type="button" onClick={saveStreak}>
        Save Streak
      </button>

      <button type="button" onClick={markTodayStudied}>
        🔥 Mark Today as Studied
      </button>
    </div>
  )
}

export default DailyStreak