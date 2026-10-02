import { useEffect, useState } from 'react'
import { getApiUrl } from '../api.js'

function Teams() {
  const [teams, setTeams] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    fetch(getApiUrl('teams'))
      .then((response) => {
        if (!response.ok) throw new Error('Teams could not be loaded.')
        return response.json()
      })
      .then((data) => {
        if (active) {
          setTeams(Array.isArray(data) ? data : [])
          setStatus('ready')
        }
      })
      .catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [])

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">Better together</p><h1>Teams</h1><p className="page-subtitle">Find your people and keep each other moving.</p></div></div>
      <div className="content-panel">
        {status === 'loading' && <div className="status-message" role="status">Loading teams...</div>}
        {status === 'error' && <div className="status-message error" role="alert">Teams are unavailable. Check the API connection and try again.</div>}
        {status === 'ready' && teams.length === 0 && <div className="status-message">No teams have been created yet.</div>}
        {status === 'ready' && teams.length > 0 && (
          <div className="team-grid">{teams.map((team) => (
            <article className="team-item" key={team._id}>
              <h2>{team.name || 'Unnamed team'}</h2>
              <p>{Array.isArray(team.members) ? team.members.length : 0} members</p>
            </article>
          ))}</div>
        )}
      </div>
    </section>
  )
}

export default Teams