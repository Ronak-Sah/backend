class ApiError extends Error{
    constructor(
        stackCode,
        message = "Something error happened",
        errors = [],
        stack = ""
    ){
        super(message);

        this.message = message;
        this.stackCode = stackCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };

