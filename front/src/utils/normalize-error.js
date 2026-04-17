export const normalizeError = (err) => {
  console.log(err);

  return {
    message: err.message ,
    code: err.code,
    status: err.status
  }
}