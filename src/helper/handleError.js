export const errorHandler = (error) => {
    let message = "";
  console.log(error?.response?.data?.detail)
  if(error?.response?.data?.detail && typeof error?.response?.data?.detail==="string"){
    message=error?.response?.data?.detail
    return message
  }
    if (error) {
      switch (error.status) {
        case 400:
          message = "Bad Request";
          break;
        case 401:
          message = "Unauthorized";
          break;
        case 403:
          message = "Forbidden";
          break;
        case 404:
          message = "Not Found";
        case 422:
          message = "Unprocessable Entity, Please try again";
          break;
        case 500:
          message = "Internal Server Error";
        case 502:
          message = "Internal Server Error";
          break;
        default:
          message = "An error occurred please try again";
          break;
      }
    }
  
    return message;
  };
  

  