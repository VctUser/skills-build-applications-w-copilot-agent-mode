import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

function displayUser(user) {
  if (!user) return 'Unknown athlete'
  if (typeof user === 'object') return user.name || user.username || user._id || 'Athlete'
  return `Athlete ${String(user).slice(-6)}`
}

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    fetch(`${API_BASE_URL}/api/leaderboard/`)
      .then((response) => {
        if (!response.ok) throw new Error('Leaderboard could not be loaded.')
        return response.json()
      })
      .then((data) => {
        if (active) {
          setEntries(Array.isArray(data) ? [...data].sort((left, right) => (
            (left.rank ?? Number.MAX_SAFE_INTEGER) - (right.rank ?? Number.MAX_SAFE_INTEGER)
            || (right.points ?? 0) - (left.points ?? 0)
          )) : [])
          setStatus('ready')
        }
      })
      .catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [])

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">Community standings</p><h1>Leaderboard</h1><p className="page-subtitle">A little friendly competition goes a long way.</p></div></div>
      <div className="content-panel">
        {status === 'loading' && <div className="status-message" role="status">Loading standings...</div>}
        {status === 'error' && <div className="status-message error" role="alert">Standings are unavailable. Check the API connection and try again.</div>}
        {status === 'ready' && entries.length === 0 && <div className="status-message">No leaderboard entries yet.</div>}
        {status === 'ready' && entries.length > 0 && (
          <table className="table">
            <thead><tr><th>Rank</th><th>Athlete</th><th>Points</th></tr></thead>
            <tbody>{entries.map((entry, index) => (
              <tr key={entry._id}>
                <td className={`rank-cell ${index === 0 ? 'rank-first' : ''}`}>{entry.rank ?? index + 1}</td>
                <td className="primary-cell">{displayUser(entry.user)}</td>
                <td className="primary-cell">{entry.points ?? 0} pts</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default Leaderboard