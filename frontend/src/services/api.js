const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const USER_ID = import.meta.env.VITE_USER_ID

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': USER_ID,
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`
    try {
      const payload = await response.json()
      detail = payload.detail ?? detail
    } catch {
      // Keep fallback detail when response body is not JSON.
    }
    const error = new Error(detail)
    error.status = response.status
    throw error
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function getAvailableBooks() {
  return request('/books?available=true', { method: 'GET' })
}

export function createLoan(bookId) {
  return request('/loans', {
    method: 'POST',
    body: JSON.stringify({ book_id: bookId }),
  })
}

export function getMyLoans() {
  return request('/loans/me', { method: 'GET' })
}

export function returnLoan(loanId) {
  return request(`/loans/${loanId}/return`, { method: 'POST' })
}

