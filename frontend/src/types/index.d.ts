type ApiErrorPayload = {
  message?: string;
  error?: string | { details?: Array<{ message?: string }> };
};
