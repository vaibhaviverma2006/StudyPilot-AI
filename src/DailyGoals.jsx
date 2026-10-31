import { useState, useEffect} from 'react'
function DailyGoals() {
    const [dailyTarget, setDailyTarget] = useState(2)
const [completedHours, setCompletedHours] = useState(0)
const [saved, setSaved] = useState(false)
const saveGoal = () => {
  const goalData = {
    dailyTarget,
    completedHours
  }

  localStorage.setItem('dailyStudyGoal', JSON.stringify(goalData))

  setSaved(true)
}
useEffect(() => {
  const savedGoal = localStorage.getItem('dailyStudyGoal')

  if (savedGoal) {
    const goalData = JSON.parse(savedGoal)

    setDailyTarget(goalData.dailyTarget)
    setCompletedHours(goalData.completedHours)
    setSaved(true)
  }
}, [])
const progress = dailyTarget > 0
  ? Math.min(Math.round((completedHours / dailyTarget) * 100), 100)
  : 0
  return (
    <div className="daily-goals">
  <h2>🎯 Daily Study Goals</h2>

  <p>Set your daily target and achieve your learning goals!</p>

  <label>Daily Study Target (Hours)</label>
  <input
    type="number"
    value={dailyTarget}
    onChange={(e) => {
      setDailyTarget(Number(e.target.value))
      setSaved(false)
    }}
    min="1"
  />

  <label>Completed Study Hours</label>
  <input
    type="number"
    value={completedHours}
    onChange={(e) => {
      setCompletedHours(Number(e.target.value))
      setSaved(false)
    }}
    min="0"
  />

  <button type="button" onClick={saveGoal}>
    Save Daily Goal
  </button>
<div className="goal-progress">
  <h3>Today's Progress: {progress}%</h3>

  <div className="progress-track">
    <div
      className="progress-fill"
      style={{ width: `${progress}%` }}
    ></div>
  </div>

  <p>
    {completedHours} out of {dailyTarget} hours completed
  </p>
</div>
  {saved && <p>Daily goal saved successfully! ✅</p>}
</div>
  )
}

export default DailyGoals