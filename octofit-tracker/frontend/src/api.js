export function getApiUrl(component) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000'

  return `${apiBaseUrl}/api/${component}/`
}

export function getResponseItems(response) {
  if (Array.isArray(response)) return response
  if (!response || typeof response !== 'object') return []

  const candidates = [response.results, response.data, response.items, response.docs]
  return candidates.find(Array.isArray) || []
}