

export function normalizePort(val: string): number {
  const port: number = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return port;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return 0;
}