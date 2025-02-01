class ApiError extends Error {
    constructor(
        statusCode,
        message= "something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)    //super keyword override krne ke liye constructor pr
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.errors = errors
        this.success = false

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }


}
export default ApiError