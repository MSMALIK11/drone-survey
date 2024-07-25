import axios from 'axios'
import {refreshAccessToken} from  '../helper/refreshToken'
const timeout=15000
const headers={
    Accept:'application/json',
    'Content-Type':'application/json',
}

export const mappingService=axios.create({
    baseURL:process.env.REACT_APP_BASE_URL,
    credentials:true ,
    timeout,
    headers
})

// Add a response interceptor
mappingService.interceptors.response.use(
    (response) => {
      // Return the response if no error
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
  
      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data === 'Access token is missing.'
      ) {
        try {
          const newAccessToken = await refreshAccessToken();
          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          // Retry the original request with the new token
          return axios(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
  
      // If the error does not match the criteria, reject it as usual
      return Promise.reject(error);
    }
  );
// mappingService.interceptors.request.use(
//   async  config => {
//     const token = getRefreshToken();
//     const refreshTime = 1 * 60 * 1000;
//     const refreshStartTime = localStorage.getItem('refreshStartTime');
//     const currentTime = new Date().getTime();
//     const diff = currentTime - refreshStartTime;

//     try {
//       if (diff>=refreshTime && token) {
//         const payload={
//       token:token
//         }
//          const res = await axios.put(`${process.env.BASE_URL}/account/regenrate-access-token`,payload)
//         if (res.status === 200) {
//           localStorage.setItem('refreshStartTime', new Date().getTime());
          
//         }
//       }
//     } catch (error) {
//       console.error('Error in request interceptor:', error);
//       // window.location.href="/login"
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

export default mappingService;


