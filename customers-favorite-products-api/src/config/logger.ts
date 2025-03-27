export abstract class Logger {
    abstract error(message: any, ...optionalParams: any[]): Promise<void>;
}