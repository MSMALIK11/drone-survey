import React from "react";
import ImageIcon from "@mui/icons-material/Image";
const UploadImage = () => {
  return (
    <div>
      <button className="bg-white rounded-full  flex items-center gap-2 border  px-4 py-1 h-[40px]  text-sm hover:bg-softBlue hover:text-white transition duration-300 ">
        <ImageIcon /> Upload Image
      </button>
    </div>
  );
};

export default UploadImage;
