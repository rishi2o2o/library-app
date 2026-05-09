import { Box, Text, Image } from '@chakra-ui/react'
import { useState } from 'react'
import { getOpenLibraryCoverUrl } from '../utils/covers.js'

function BookCover({ isbn, title }) {
  const [failed, setFailed] = useState(false)
  const src = getOpenLibraryCoverUrl(isbn)

  const sharedProps = {
    w: { base: '100%', md: '140px' },
    maxW: { base: '200px', md: '140px' },
    mx: { base: 'auto', md: 0 },
    flexShrink: 0,
    aspectRatio: 2 / 3,
    borderRadius: 'md',
    borderWidth: '1px',
    borderColor: 'gray.200',
  }

  if (!src || failed) {
    return (
      <Box
        {...sharedProps}
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="sm" color="gray.500" textAlign="center" px={2}>
          No cover
        </Text>
      </Box>
    )
  }

  return (
    <Image
      {...sharedProps}
      src={src}
      alt={`Cover: ${title}`}
      objectFit="contain"
      bg="white"
      onError={() => setFailed(true)}
    />
  )
}

export default BookCover