import multer from "multer";

const MAX_FILE_SIZE=10*1024*1024

const storage =multer.memoryStorage();
export const uploadImge=multer({
    storage,limits:{
        fileSize:MAX_FILE_SIZE,
        files:1
    },
    fileFilter:(req,file,callback)=>{
        const allowedType=["image/jpeg","image/png"];
        if (allowedType.includes(file.mimetype)) {
            callback(null,true)
        }else{
            callback(null,false)
        }
    }
})