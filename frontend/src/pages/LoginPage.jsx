import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { login as apiLogin } from '../services/api.js'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await apiLogin(email, password)
      login(response.access_token)
      navigate('/books')
    } catch (error) {
      if (error.status === 401) {
        setErrorMessage('Invalid email or password. Please try again.')
      } else {
        setErrorMessage(error.message || 'An error occurred during login.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <Card.Root maxW="md" w="full">
        <Card.Header>
          <Heading size="lg" textAlign="center">
            Library System
          </Heading>
          <Text textAlign="center" color="gray.600" mt={2}>
            Sign in to your account
          </Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              {errorMessage && (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Login Failed</Alert.Title>
                    <Alert.Description>{errorMessage}</Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}

              <Stack gap={2}>
                <Text fontWeight="medium" fontSize="sm">
                  Email
                </Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </Stack>

              <Stack gap={2}>
                <Text fontWeight="medium" fontSize="sm">
                  Password
                </Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </Stack>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                loading={loading}
                mt={2}
              >
                Sign In
              </Button>

              <Box mt={4} p={3} bg="blue.50" borderRadius="md">
                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  Test Credentials:
                </Text>
                <Text fontSize="sm">Email: mel@example.com</Text>
                <Text fontSize="sm">Email: rob@example.com</Text>
                <Text fontSize="sm">Password: Password123!</Text>
              </Box>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}

export default LoginPage

