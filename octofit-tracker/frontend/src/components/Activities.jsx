import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

function displayUser(user) {
  if (!user) return 'Unknown athlete'
  if (typeof user === 'object') return user.name || user.username || user._id || 'Athlete'
  return `Athlete ${String(user).slice(-6)}`
}

function Activities() {
  const [activities, setActivities] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    fetch(`${API_BASE_URL}/api/activities/`)
      .then((response) => {
        if (!response.ok) throw new Error('Activities could not be loaded.')
        return response.json()
      })
      .then((data) => {
        if (active) {
          setActivities(Array.isArray(data) ? data : [])
          setStatus('ready')
        }
      })
      .catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [])

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">Training log</p><h1>Activities</h1><p className="page-subtitle">Recent movement from across your community.</p></div></div>
      <div className="content-panel">
        {status === 'loading' && <div className="status-message" role="status">Loading activities...</div>}
        {status === 'error' && <div className="status-message error" role="alert">Activities are unavailable. Check the API connection and try again.</div>}
        {status === 'ready' && activities.length === 0 && <div className="status-message">No activities have been recorded yet.</div>}
        {status === 'ready' && activities.length > 0 && (
          <table className="table">
            <thead><tr><th>Athlete</th><th>Activity</th><th>Duration</th><th>Distance</th><th>Points</th><th>Date</th></tr></thead>
            <tbody>{activities.map((activity) => (
              <tr key={activity._id}>
                <td className="primary-cell">{displayUser(activity.user)}</td>
                <td><span className="soft-badge">{activity.activityType || 'Activity'}</span></td>
                <td>{activity.durationMinutes ?? '--'} min</td>
                <td>{activity.distanceKm == null ? '--' : `${activity.distanceKm} km`}</td>
                <td className="primary-cell">{activity.points ?? 0}</td>
                <td>{activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : '--'}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default Activities