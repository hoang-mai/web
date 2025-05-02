export {};

declare global {
  interface ErrorResponse {
    status_code: number;
    message: string;
    timestamp: Date;
    path: string;
  }
}
