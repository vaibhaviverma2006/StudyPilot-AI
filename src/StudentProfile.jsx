import { useState, useEffect } from 'react'

function StudentProfile() {
  const [studentName, setStudentName] = useState('Student Name')
  const [course, setCourse] = useState('B.Sc. Computer Science')
  const [college, setCollege] = useState('GNIOT Institute')
  const [year, setYear] = useState('Third Year')
  const [saved, setSaved] = useState(false)
  const [profileMessage, setProfileMessage] = useState ("")
  useEffect(() => {
  const savedProfile = localStorage.getItem('studentProfile')

  if (savedProfile) {
    const profileData = JSON.parse(savedProfile)

    setStudentName(profileData.studentName)
    setCourse(profileData.course)
    setCollege(profileData.college)
    setYear(profileData.year)
    setSaved(true)
    setProfileMessage('Profile loaded successfully! ✅')
  }
}, [])
  const saveProfile = () => {
  const profileData = {
    studentName,
    course,
    college,
    year
  }

  localStorage.setItem('studentProfile', JSON.stringify(profileData))

  setSaved(true)
  setProfileMessage('Profile saved successfully! ✅')
}

  return (
    <div className="student-profile">
        <h2>Student Profile</h2>

      <div className="profile-details">
        <p>
  <strong>Name:</strong>
  <input
    type="text"
    value={studentName}
    onChange={(e) => setStudentName(e.target.value)}
    placeholder="Enter your name"
  />
</p>
        <p>
  <strong>Course:</strong>
  <input
    type="text"
    value={course}
    onChange={(e) => setCourse(e.target.value)}
    placeholder="Enter your course"
  />
</p>
        <p>
  <strong>College:</strong>
  <input
    type="text"
    value={college}
    onChange={(e) => setCollege(e.target.value)}
    placeholder="Enter your college"
  />
</p>
        <p>
  <strong>Year:</strong>
  <input
    type="text"
    value={year}
    onChange={(e) => setYear(e.target.value)}
    placeholder="Enter your year"
  />
</p>
<button
  type="button"
  onClick={saveProfile}
>
  Save Profile
</button>

{saved && (
  <p style={{ color: 'green', fontWeight: 'bold' }}>
    Profile saved successfully! ✅
  </p>
)}
      </div>
    </div>
  )
}

export default StudentProfile