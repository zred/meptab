export class Logger {
  static async log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    console.log(logMessage);

    try {
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: timestamp,
          level: level.toUpperCase(),
          message
        }),
      });

      if (!response.ok) {
        console.error('Failed to send log to server:', await response.text());
      }
    } catch (error) {
      console.error('Error sending log to server:', error);
    }
  }

  static async error(message, error) {
    await this.log(`${message}: ${error.message}`, 'error');
    console.error(error);
  }
}

export async function handleError(error, context) {
  await Logger.error(`Error in ${context}`, error);
}
