import { useState, useEffect } from 'react'

function WeeklyActivity() {
  const [studyHours, setStudyHours] = useState([
    { day: 'Monday', hours: 0 },
    { day: 'Tuesday', hours: 0 },
    { day: 'Wednesday', hours: 0 },
    { day: 'Thursday', hours: 0 },
    { day: 'Friday', hours: 0 },
    { day: 'Saturday', hours: 0 },
    { day: 'Sunday', hours: 0 }
  ])

  // Load saved weekly activity
  useEffect(() => {
    const savedActivity = localStorage.getItem('weeklyStudyActivity')

    if (savedActivity) {
      setStudyHours(JSON.parse(savedActivity))
    }
  }, [])

  // Update study hours
  const updateHours = (index, value) => {
    const updatedHours = [...studyHours]

    updatedHours[index].hours = Math.max(0, Number(value))

    setStudyHours(updatedHours)

    localStorage.setItem(
      'weeklyStudyActivity',
      JSON.stringify(updatedHours)
    )
  }

  // Calculate total study hours
  const totalHours = studyHours.reduce(
    (total, day) => total + day.hours,
    0
  )

  return (
    <div className="weekly-activity">
      <h2>📊 Weekly Study Activity</h2>

      <p>Track your study hours throughout the week!</p>

      <h3>Total Study Hours: {totalHours}</h3>

      {studyHours.map((day, index) => (
        <div className="weekly-day" key={day.day}>
          <label>{day.day}</label>

          <input
            type="number"
            min="0"
            value={day.hours}
            onChange={(e) => updateHours(index, e.target.value)}
          />

          <div className="weekly-progress">
            <div
              className="weekly-progress-fill"
              style={{
                width: `${Math.min(day.hours * 10, 100)}%`
              }}
            ></div>
          </div>

          <span>{day.hours} hours</span>
        </div>
      ))}
    </div>
  )
}

export default WeeklyActivity