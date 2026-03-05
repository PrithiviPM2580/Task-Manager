import axios from "axios";

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    if (payload?.message) return payload.message;
    if (typeof payload?.error === "string") return payload.error;

    const detailMessage = payload?.error?.details?.[0]?.message;
    if (detailMessage) return detailMessage;
  }

  return "An unexpected error occurred. Please try again later.";
};
