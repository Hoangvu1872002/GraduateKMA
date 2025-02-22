import axiosClient from './axiosClient';

// class AuthAPI {
//   HandleAuthentication = async (
//     url: string,
//     data?: any,
//     method?: 'get' | 'post' | 'put' | 'delete',
//   ) => {
//     return await axiosClient(`/auth${url}`, {
//       method: method ?? 'get',
//       data,
//     });
//   };
// }

// const authenticationAPI = new AuthAPI();
// export default authenticationAPI;

export const apiVerification = async (data?: any) =>
  axiosClient({
    url: '/auth-driver/verification',
    method: 'post',
    data,
  });

export const apiForgotpassword = async (data?: any) =>
  axiosClient({
    url: '/auth-driver/forgotpassword',
    method: 'post',
    data,
  });

export const apiRegister = async (data?: any) =>
  axiosClient({
    url: '/auth-driver/register',
    method: 'post',
    data,
  });

export const apiLogin = (data?: any) =>
  axiosClient({
    url: '/auth-driver/login',
    method: 'post',
    data,
  });
