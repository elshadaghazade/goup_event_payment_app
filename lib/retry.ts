type RetryOptions = {
    retries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
    jitter?: boolean;
    name: string;
};

export class Retry {
    static async execute<T>(
        fn: () => Promise<T>,
        options: RetryOptions
    ): Promise<T> {
        const { retries=3, initialDelay=100, maxDelay = Infinity, factor = 2, jitter = true, name="" } = options || {};

        let attempt = 0;
        let delay = initialDelay;

        const executeFn = async (): Promise<T> => {
            try {
                return await fn();
            } catch (error: any) {
                if (error.code === 503 && attempt < retries) {
                    attempt++;
                    delay = Math.min(delay * factor, maxDelay);

                    if (jitter) {
                        // Add jitter by randomizing the delay to spread out the retry attempts
                        delay = Retry.randomizeDelay(delay);
                    }

                    console.log(`Retry attempt ${attempt}: retrying in ${delay}ms; Name: ${name}`);
                    await Retry.delay(delay);
                    return executeFn();
                } else {
                    throw error;
                }
            }
        };

        return executeFn();
    }

    private static delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private static randomizeDelay(delay: number): number {
        // Randomize delay to avoid thundering herd problem (50% - 100% of delay)
        return delay * 0.5 + Math.random() * delay * 0.5;
    }
}
