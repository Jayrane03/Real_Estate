export function validate(schemas) {
  return (req, res, next) => {
    req.validated = req.validated || {}
    for (const [part, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[part])
      if (!result.success) {
        return res.status(400).json({
          message: 'Please check the submitted information.',
          errors: result.error.flatten().fieldErrors,
        })
      }
      req.validated[part] = result.data
    }
    next()
  }
}