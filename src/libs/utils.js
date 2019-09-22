export const getInit = (options = {}) => {
  return {
    ...options,
    headers: { 'x-api-key': process.env.REACT_APP_API_GW_API_KEY }
  }
}