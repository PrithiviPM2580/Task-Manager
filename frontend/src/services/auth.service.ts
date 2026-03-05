import { API_PATHS } from "@/utils/api-paths";
import axiosInstance from "@/utils/axios-instance";
import type {
  LoginFormData,
  SignUpFormData,
} from "@/validation/auth.validation";
import { getErrorMessage } from "@/utils/helper";

export const login = async (loginData: LoginFormData) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, loginData);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const signUp = async (signUpData: SignUpFormData) => {
  try {
    const formData = new FormData();

    formData.append("name", signUpData.name);
    formData.append("email", signUpData.email);
    formData.append("password", signUpData.password);

    if (signUpData.adminInviteToken) {
      formData.append("adminInviteToken", signUpData.adminInviteToken);
    }

    if (signUpData.profileImageUrl) {
      formData.append("profileImage", signUpData.profileImageUrl);
    }

    const response = await axiosInstance.post(
      API_PATHS.AUTH.REGISTER,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
