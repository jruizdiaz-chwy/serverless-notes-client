import config from  '../config'

export const getInit = (options = {}) => {
  return {
    ...options,
    headers: { 'x-api-key': config.apiGateway.API_KEY }
  }
}