export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists.' })
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: 'The submitted data is invalid.' })
  }

  const status = error.status || 500
  if (status >= 500) console.error(error)
  res.status(status).json({
    message: status >= 500 ? 'An unexpected server error occurred.' : error.message,
  })
}