export const success = (res, data) => {
  return res.json({
    success: true,
    data
  })
}
