class Logger {
    log(...strs: any[]) {
        const args = [...strs];
        const stack = new Error().stack!;
        let line = stack.split('\n')[3] || '';
        const pathMatch = line.match(/\(([^)]+)\)/);
        if (pathMatch) {
            const path = pathMatch[1];
            args.push('--', '\x1b[32m', path, '\x1b[0m');
        }
        return args;
    }
}

export const logger = new Logger();