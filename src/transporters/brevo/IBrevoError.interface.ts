export interface IBrevoError extends Error {
  code: string
  message: string
}