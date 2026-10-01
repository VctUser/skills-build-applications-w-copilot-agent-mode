import { useEffect, useState } from 'react'
import { getApiUrl, getResponseItems } from '../api.js'

function Users() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    fetch(getApiUrl('users'))
      .then((response) => {
        if (!response.ok) throw new Error('Users could not be loaded.')
        return response.json()
      })
      .then((data) => {
        if (active) {
          setUsers(getResponseItems(data))
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
          <p className="eyebrow">Community</p>
          <h1>Users</h1>
          <p className="page-subtitle">Meet the athletes tracking their progress with OctoFit.</p>
        </div>
      </div>
      <div className="content-panel">
        {status === 'loading' && <div className="status-message" role="status">Loading users...</div>}
        {status === 'error' && <div className="status-message error" role="alert">Users are unavailable. Check the API connection and try again.</div>}
        {status === 'ready' && users.length === 0 && <div className="status-message">No users have joined yet.</div>}
        {status === 'ready' && users.length > 0 && (
          <table className="table">
            <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Joined</th></tr></thead>
            <tbody>{users.map((user) => (
              <tr key={user._id}>
                <td className="primary-cell">{user.displayName || user.username || 'Athlete'}</td>
                <td>{user.username ? `@${user.username}` : '--'}</td>
                <td>{user.email || '--'}</td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '--'}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default Users