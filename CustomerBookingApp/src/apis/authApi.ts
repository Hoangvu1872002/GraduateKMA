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
    url: '/auth/verification',
    method: 'post',
    data,
  });

export const apiRegister = async (data?: any) =>
  axiosClient({
    url: '/auth/register',
    method: 'post',
    data,
  });

export const apiLogin = (data?: any) =>
  axiosClient({
    url: '/auth/login',
    method: 'post',
    data,
  });
