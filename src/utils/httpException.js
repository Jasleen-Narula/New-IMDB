class HttpException extends Error {
    statusCode;
    error;
    
    constructor(statusCode, message, error) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = error || null;
    }
    
}

module.exports = HttpException;