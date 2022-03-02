"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const custom_errors_1 = require("./custom-errors");
class RequestValidationError extends custom_errors_1.CustomError {
    constructor(errors) {
        super('Invalid request parameters');
        this.errors = errors;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map((err) => {
            return { message: err.msg, field: err.param };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
