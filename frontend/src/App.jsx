import { Container } from '@chakra-ui/react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import TopNav from './components/TopNav.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import AvailableBooksPage from './pages/AvailableBooksPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <TopNav />
                <Container maxW="6xl" py={6}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/books" replace />} />
                    <Route path="/books" element={<AvailableBooksPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                  </Routes>
                </Container>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App

