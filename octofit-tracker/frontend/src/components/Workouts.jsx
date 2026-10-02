import { useEffect, useState } from 'react'

const apiUrl = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

function getResponseItems(response) {
  if (Array.isArray(response)) return response
  if (!response || typeof response !== 'object') return []

  const candidates = [response.results, response.data, response.items, response.docs]
  return candidates.find(Array.isArray) || []
}

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Workouts could not be loaded.')
        return response.json()
      })
      .then((data) => {
        if (active) {
          setWorkouts(getResponseItems(data))
          setStatus('ready')
        }
      })
      .catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [])

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Training library</p>
          <h1>Workouts</h1>
          <p className="page-subtitle">Pick a session that matches your pace and goals.</p>
        </div>
      </div>
      <div className="content-panel">
        {status === 'loading' && <div className="status-message" role="status">Loading workouts...</div>}
        {status === 'error' && <div className="status-message error" role="alert">Workouts are unavailable. Check the API connection and try again.</div>}
        {status === 'ready' && workouts.length === 0 && <div className="status-message">No workouts are available yet.</div>}
        {status === 'ready' && workouts.length > 0 && (
          <table className="table">
            <thead><tr><th>Workout</th><th>Type</th><th>Difficulty</th><th>Duration</th><th>Description</th></tr></thead>
            <tbody>{workouts.map((workout) => (
              <tr key={workout._id}>
                <td className="primary-cell">{workout.title || 'Untitled workout'}</td>
                <td><span className="soft-badge">{workout.activityType || 'General'}</span></td>
                <td>{workout.difficulty || '--'}</td>
                <td>{workout.durationMinutes == null ? '--' : `${workout.durationMinutes} min`}</td>
                <td>{workout.description || '--'}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default Workouts