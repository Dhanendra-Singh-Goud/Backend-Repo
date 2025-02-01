const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
       Promise.resolve(requestHandler(req,res,next)).
       catch((err)=>next(err))
       }
    }

export default asyncHandler
    /*
    const asynHandler = (reqHandler) =>async(req,res,next)=>{
        try{
        await reqHandler(req,res,next)
        }catch(err){
        res.status(err.code || 500).json({
        success:false,
        message:err.message
        })
        }
        }
    
    */ 
