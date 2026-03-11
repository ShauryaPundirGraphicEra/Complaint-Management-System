import multer  from "multer";

//wherever file upload is required multer's this upload function will be used and 
//below we have kept it in the disk storage temporarily

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
          const uniqueName = Date.now() + "-" + file.originalname;
          cb(null, uniqueName);
    }
  })
  
  export const upload = multer({ storage})
