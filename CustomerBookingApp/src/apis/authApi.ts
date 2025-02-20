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
    url: '/auth-user/verification',
    method: 'post',
    data,
  });

export const apiForgotpassword = async (data?: any) =>
  axiosClient({
    url: '/auth-user/forgotpassword',
    method: 'post',
    data,
  });

export const apiRegister = async (data?: any) =>
  axiosClient({
    url: '/auth-user/register',
    method: 'post',
    data,
  });

export const apiLogin = (data?: any) =>
  axiosClient({
    url: '/auth-user/login',
    method: 'post',
    data,
  });
