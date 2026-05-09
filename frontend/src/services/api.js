import { getToken, removeToken } from '../utils/auth.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

async function request(path, options = {}) {
  const token = getToken()

  const headers = {
    ...(options.headers ?? {}),
  }

  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    removeToken()
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`
    
    try {
      const payload = await response.json()
      detail = payload.detail ?? detail
    } catch (err) {
      console.debug('Non-JSON error response')
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
  return request('/books?available=true', {
    method: 'GET',
  })
}

export function createLoan(bookId) {
  return request('/loans', {
    method: 'POST',
    body: JSON.stringify({ book_id: bookId }),
  })
}

export function getMyLoans() {
  return request('/loans/me', {
    method: 'GET',
  })
}

export function returnLoan(loanId) {
  return request(`/loans/${loanId}/return`, {
    method: 'POST',
  })
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

