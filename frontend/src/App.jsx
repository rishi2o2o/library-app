import { Container } from '@chakra-ui/react'
import { Navigate, Route, Routes } from 'react-router-dom'
import TopNav from './components/TopNav.jsx'
import AvailableBooksPage from './pages/AvailableBooksPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'

function App() {
  return (
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
  )
}

export default App
