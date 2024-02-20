export interface ISendinblueError extends Error {
  code: string
  message: string
}