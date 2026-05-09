import { Navigate } from 'react-router-dom'
import { Spinner, Stack, Text } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <Stack align="center" justify="center" minH="100vh">
        <Spinner size="lg" />
        <Text>Loading...</Text>
      </Stack>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute


