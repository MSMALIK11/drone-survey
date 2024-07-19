import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from "@mui/material";
function UploadProfile({onCancel}) {
  const [image,setImage]=useState("")
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setImage(fileUrl);
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });
  useEffect(()=>{

    return ()=>{
      setImage("")
    }

  },[])

  return (
    <div className="relative">
      {
        image?  <div className="h-200px  overflow-hidden rounded-lg  shadow-lg">
        <div className="flex justify-end px-6 relative">
          <Tooltip title="Cancel" >
          <IconButton className="!bg-gray-200" onClick={onCancel}>
            <DeleteIcon />
          </IconButton>
  
          </Tooltip>
        </div> 
       <img src={image}  width={570} className="h-[200px] rounded-lg  object-fill " />
        
  
        </div>
        :
      
      <div
        {...getRootProps()}
        className="h-[200px] p-4 mt-1 bg-white shadow-lg rounded-lg border-2 border-softgray w-[570px]"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div>Drop the files here ...</div>
        ) : (
          <div className="flex items-center justify-center flex-col border-4 border-dotted h-full">

          <div className="flex flex-col items-center justify-ce">
            <MdOutlineFileUpload size={44} className="text-softBlue" />
            <p>
              <span className="text-sm text-softBlue">Click to upload,</span>
              Drag your file here
            </p>
            <p>JPG,JPEG,PNG</p>

          </div>
          </div>
        )}
      </div>
}
    </div>
  );
}

export default UploadProfile;
