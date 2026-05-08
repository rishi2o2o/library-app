import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { createLoan, getAvailableBooks } from '../services/api.js'

function AvailableBooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [borrowingBookId, setBorrowingBookId] = useState(null)

  const loadBooks = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const data = await getAvailableBooks()
      setBooks(data)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooks()
  }, [])

  const handleBorrow = async (bookId) => {
    setBorrowingBookId(bookId)
    setErrorMessage('')
    try {
      await createLoan(bookId)
      await loadBooks()
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setBorrowingBookId(null)
    }
  }

  if (loading) {
    return (
      <Stack align="center" py={10}>
        <Spinner size="lg" />
        <Text>Loading available books...</Text>
      </Stack>
    )
  }

  return (
    <Stack gap={4}>
      <Heading size="lg">Available Books</Heading>

      {errorMessage ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Could not complete request</Alert.Title>
            <Alert.Description>{errorMessage}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : null}

      {books.length === 0 ? (
        <Box borderWidth="1px" borderRadius="md" p={6}>
          <Text>No available books right now.</Text>
        </Box>
      ) : (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          {books.map((book) => (
            <Card.Root key={book.id}>
              <Card.Header>
                <Heading size="md">{book.title}</Heading>
                <Text color="gray.600">{book.author}</Text>
              </Card.Header>
              <Card.Body>
                <Stack gap={2}>
                  <Text>
                    <strong>Genre:</strong> {book.genre ?? 'N/A'}
                  </Text>
                  <Text>
                    <strong>Year:</strong> {book.publication_year ?? 'N/A'}
                  </Text>
                  <Text>
                    <strong>ISBN:</strong> {book.isbn}
                  </Text>
                  <Text>{book.description ?? 'No description available.'}</Text>
                </Stack>
              </Card.Body>
              <Card.Footer>
                <Button
                  colorScheme="blue"
                  onClick={() => handleBorrow(book.id)}
                  loading={borrowingBookId === book.id}
                >
                  Borrow Book
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </Grid>
      )}
    </Stack>
  )
}

export default AvailableBooksPage

