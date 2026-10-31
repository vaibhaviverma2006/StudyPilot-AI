function Achievements({
  topicsExplored,
  quizzesCompleted,
  studyPlansCreated,
  answersEvaluated
}) {
  return (
    <div>
      <h2>🏆 Achievements & Badges</h2>
      <p>Celebrate your learning journey!</p>
      <div className="achievement-card">
  <h3>🧠 First Quiz</h3>
  <p>Complete your first quiz and earn this badge.</p>
  <span>
  {quizzesCompleted >= 1 ? '🏆 Unlocked' : '🔒 Locked'}
</span>
</div>
<div className="achievement-card">
  <h3>📚 Knowledge Explorer</h3>
  <p>Explore 5 different topics.</p>
  <span>
  {topicsExplored >= 5 ? '🏆 Unlocked' : '🔒 Locked'}
</span>
</div>

<div className="achievement-card">
  <h3>📅 Study Planner</h3>
  <p>Create your first study plan.</p>
  <span>
  {studyPlansCreated >= 1 ? '🏆 Unlocked' : '🔒 Locked'}
</span>
</div>

<div className="achievement-card">
  <h3>✍️ Answer Master</h3>
  <p>Evaluate your first written answer.</p>
  <span>
  {answersEvaluated >= 1 ? '🏆 Unlocked' : '🔒 Locked'}
</span>
</div>
    </div>
  )
}

export default Achievements