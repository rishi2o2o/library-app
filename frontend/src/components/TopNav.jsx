import { Box, Flex, Heading, Link as ChakraLink } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

function TopNav() {
  const linkStyle = ({ isActive }) => ({
    fontWeight: isActive ? '700' : '500',
    textDecoration: 'none',
    color: isActive ? '#1a202c' : '#4a5568',
  })

  return (
    <Box borderBottom="1px solid" borderColor="gray.200" bg="white">
      <Flex maxW="6xl" mx="auto" px={4} py={4} justify="space-between" align="center">
        <Heading size="md">Library System</Heading>
        <Flex gap={4}>
          <ChakraLink as={NavLink} to="/books" style={linkStyle}>
            Available Books
          </ChakraLink>
          <ChakraLink as={NavLink} to="/history" style={linkStyle}>
            History
          </ChakraLink>
        </Flex>
      </Flex>
    </Box>
  )
}

export default TopNav
