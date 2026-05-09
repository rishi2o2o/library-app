import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import BookCover from '../components/BookCover.jsx'
import { getMyLoans, returnLoan } from '../services/api.js'

function formatDate(value) {
  if (!value) {
    return 'N/A'
  }
  return new Date(value).toLocaleString()
}

function HistoryPage() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [returningLoanId, setReturningLoanId] = useState(null)

  const loadLoans = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const data = await getMyLoans()
      setLoans(data)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLoans()
  }, [])

  const handleReturn = async (loanId) => {
    setReturningLoanId(loanId)
    setErrorMessage('')
    try {
      await returnLoan(loanId)
      await loadLoans()
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setReturningLoanId(null)
    }
  }

  if (loading) {
    return (
      <Stack align="center" py={10}>
        <Spinner size="lg" />
        <Text>Loading borrowing history...</Text>
      </Stack>
    )
  }

  return (
    <Stack gap={4}>
      <Heading size="lg">Borrowing History</Heading>

      {errorMessage ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Could not load history</Alert.Title>
            <Alert.Description>{errorMessage}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : null}

      {loans.length === 0 ? (
        <Box borderWidth="1px" borderRadius="md" p={6}>
          <Text>No borrowing history yet.</Text>
        </Box>
      ) : (
        loans.map((loan) => (
          <Card.Root
            key={loan.id}
            borderColor={loan.is_active ? 'blue.400' : 'gray.200'}
            borderWidth="1px"
          >
            <Card.Header>
              <Stack direction="row" justify="space-between" align="center">
                <Heading size="md">{loan.book_title ?? `Book #${loan.book_id}`}</Heading>
                <Badge colorPalette={loan.is_active ? 'blue' : 'gray'}>
                  {loan.is_active ? 'Active Loan' : 'Returned'}
                </Badge>
              </Stack>
            </Card.Header>
            <Card.Body>
              <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                <BookCover
                  isbn={loan.book_isbn}
                  title={loan.book_title ?? `Book #${loan.book_id}`}
                />
                <Stack gap={1}>
                  <Text>
                    <strong>Status:</strong> {loan.status}
                  </Text>
                  <Text>
                    <strong>Borrowed At:</strong> {formatDate(loan.borrowed_at)}
                  </Text>
                  <Text>
                    <strong>Returned At:</strong> {formatDate(loan.returned_at)}
                  </Text>
                </Stack>
              </Stack>
            </Card.Body>
            {loan.is_active ? (
              <Card.Footer>
                <Button
                  colorScheme="green"
                  onClick={() => handleReturn(loan.id)}
                  loading={returningLoanId === loan.id}
                >
                  Return Book
                </Button>
              </Card.Footer>
            ) : null}
          </Card.Root>
        ))
      )}
    </Stack>
  )
}

export default HistoryPage

