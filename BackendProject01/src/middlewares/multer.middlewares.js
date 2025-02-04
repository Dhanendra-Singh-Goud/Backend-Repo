import multer from 'multer'

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
    //in filename we also use suffix prefix read form docs more info
    cb(null,file.originalname)
     }
    }
)
export const upload = multer({
    storage:storage,
})