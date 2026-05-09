import { Box, Button, Flex, Heading, Link as ChakraLink, Text } from '@chakra-ui/react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

function TopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const linkStyle = ({ isActive }) => ({
    fontWeight: isActive ? '700' : '500',
    textDecoration: 'none',
    color: isActive ? '#1a202c' : '#4a5568',
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box borderBottom="1px solid" borderColor="gray.200" bg="white">
      <Flex maxW="6xl" mx="auto" px={4} py={4} justify="space-between" align="center">
        <Heading size="md">Library System</Heading>
        <Flex gap={4} align="center">
          <ChakraLink as={NavLink} to="/books" style={linkStyle}>
            Available Books
          </ChakraLink>
          <ChakraLink as={NavLink} to="/history" style={linkStyle}>
            History
          </ChakraLink>
          {user?.email && (
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {user.email}
            </Text>
          )}
          <Button size="sm" colorScheme="red" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default TopNav
