export const handleSuccess = (
  res,
  data,
  statusCode = 200,
  message = "Success"
) => {
  return res.status(statusCode).json({
    message,
    data,
  });
};

export const handleError = (res, statusCode = 500, message = "Error") => {
  return res.status(statusCode).json({
    message,
    data: null,
  });
};
