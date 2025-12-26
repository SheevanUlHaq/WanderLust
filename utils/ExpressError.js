class ExpressError extends Error{
    constructor(statusCode,message){
        super();                // we can use super(message)
        this.message=message;   // then this line is not needed
        this.statusCode=statusCode;
    }
}
module.exports=ExpressError;