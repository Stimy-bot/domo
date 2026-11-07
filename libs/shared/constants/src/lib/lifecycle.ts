// libs/utils/src/lib/lifecycle.ts
type CleanupCallback = () => void | Promise<void>;

const lifecycle = (() => {
  const cleanupTasks: CleanupCallback[] = [];

  /**
   * Register a synchronous or asynchronous cleanup function.
   */
  const register = (callback: CleanupCallback): void => {
    cleanupTasks.push(callback);
  };

  /**
   * Executes all registered cleanup functions in parallel and waits for completion.
   */
  const shutdown = async (): Promise<void> => {
    // Run all tasks and collect results
    const results = await Promise.allSettled(
      cleanupTasks.map((callback) => Promise.resolve().then(() => callback())),
    );

    // Log errors for any failed cleanups
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Error during task #${index + 1} cleanup:`, result.reason);
      }
    });
  };

  return { register, shutdown };
})();

export { lifecycle };
