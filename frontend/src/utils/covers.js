/**
 * Build Open Library cover image URL for a book ISBN (ISBN-10 or ISBN-13).
 * @param {string} isbn
 * @returns {string}
 */
export function getOpenLibraryCoverUrl(isbn) {
  const digits = String(isbn ?? '').replace(/\D/g, '')
  if (!digits) {
    return ''
  }
  return `https://covers.openlibrary.org/b/isbn/${digits}-L.jpg`
}
