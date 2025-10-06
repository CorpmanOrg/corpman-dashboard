interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      payload?: {
        responseMessage?: string;
      };
    };
  };
  message?: string;
}

interface ErrorResult {
  message: string;
  status?: number;
  type: "network" | "server" | "client" | "unknown";
  shouldRetry: boolean;
}

export function getErrorMessage(error: unknown): string {
  let message = "An unexpected error occurred. Please try again.";

  // Type guard to check if error has axios response structure
  const apiError = error as ApiError;
  const status = apiError?.response?.status;

  if (status === 400) {
    message = "Bad request. Please check your input.";
  } else if (status === 401) {
    message = "Unauthorized. Please log in again.";
  } else if (status === 403) {
    message = "You do not have permission to perform this action.";
  } else if (status === 404) {
    message = "Requested resource not found.";
  } else if (status === 409) {
    message = "Conflict detected. Please try again.";
  } else if (status === 422) {
    message = "Unprocessable entity. Please check your input.";
  } else if (status === 429) {
    message = "Too many requests. Please slow down.";
  } else if (status === 500) {
    message = "Internal server error. Please try again later.";
  } else if (status === 502) {
    message = "Bad gateway. Please try again later.";
  } else if (status === 503) {
    message = "Service is temporarily unavailable. Please try again later.";
  } else if (status === 504) {
    message = "The server took too long to respond. Please try again later.";
  } else if (apiError?.response?.data?.payload?.responseMessage) {
    message = apiError.response.data.payload.responseMessage;
  } else if (apiError?.response?.data?.message) {
    message = apiError.response.data.message;
  } else if (apiError?.message) {
    message = apiError.message;
  }

  return message;
}

// Enhanced error handler with more context
export function handleApiError(error: unknown): ErrorResult {
  const apiError = error as ApiError;
  const status = apiError?.response?.status;

  let message = "An unexpected error occurred. Please try again.";
  let type: ErrorResult["type"] = "unknown";
  let shouldRetry = false;

  if (status) {
    if (status >= 400 && status < 500) {
      type = "client";
      shouldRetry = status === 408 || status === 429; // Timeout or rate limit

      switch (status) {
        case 400:
          message = "Bad request. Please check your input.";
          break;
        case 401:
          message = "Your session has expired. Please log in again.";
          break;
        case 403:
          message = "You don't have permission to perform this action.";
          break;
        case 404:
          message = "The requested resource was not found.";
          break;
        case 409:
          message = "This action conflicts with existing data.";
          break;
        case 422:
          message = "Please check your input and try again.";
          break;
        case 429:
          message = "Too many requests. Please wait a moment.";
          shouldRetry = true;
          break;
      }
    } else if (status >= 500) {
      type = "server";
      shouldRetry = true;

      switch (status) {
        case 500:
          message = "Server error. We're working to fix this.";
          break;
        case 502:
          message = "Service temporarily unavailable. Please try again.";
          break;
        case 503:
          message = "Service is under maintenance. Please try again later.";
          break;
        case 504:
          message = "Request timed out. Please try again.";
          break;
        default:
          message = "Server error. Please try again later.";
      }
    }
  } else if (apiError?.message?.includes("Network Error")) {
    type = "network";
    shouldRetry = true;
    message = "Network error. Please check your connection.";
  } else if (apiError?.message?.includes("timeout")) {
    type = "network";
    shouldRetry = true;
    message = "Request timed out. Please try again.";
  }

  // Try to extract more specific error message from server
  if (apiError?.response?.data?.payload?.responseMessage) {
    message = apiError.response.data.payload.responseMessage;
  } else if (apiError?.response?.data?.message) {
    message = apiError.response.data.message;
  }

  return {
    message,
    status,
    type,
    shouldRetry,
  };
}

// Utility to check if error should trigger logout
export function shouldLogout(error: unknown): boolean {
  const apiError = error as ApiError;
  return apiError?.response?.status === 401;
}

// Utility to format error for logging (excludes sensitive data)
export function formatErrorForLogging(error: unknown): Record<string, any> {
  const apiError = error as ApiError;

  return {
    status: apiError?.response?.status,
    message: apiError?.message,
    url: (apiError as any)?.config?.url,
    method: (apiError as any)?.config?.method,
    timestamp: new Date().toISOString(),
    // Don't log request data for security
  };
}

// Hook-friendly error handler for React Query
export function createErrorHandler(options?: {
  showToast?: (message: string, type: "error" | "warning") => void;
  onRetry?: () => void;
  onLogout?: () => void;
}) {
  return (error: unknown) => {
    const errorResult = handleApiError(error);

    // Show toast notification
    if (options?.showToast) {
      const toastType = errorResult.shouldRetry ? "warning" : "error";
      options.showToast(errorResult.message, toastType);
    }

    // Handle logout
    if (shouldLogout(error) && options?.onLogout) {
      options.onLogout();
    }

    // Log for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", formatErrorForLogging(error));
    }

    return errorResult;
  };
}
