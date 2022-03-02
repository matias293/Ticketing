import { CustomError } from './custom-errors';
export declare class DatabaseConnectionError extends CustomError {
    statusCode: number;
    reason: string;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
