export const extractErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object' &&
    'message' in error.data &&
    typeof (error.data as any).message === 'string'
  ) {
    return (error.data as { message?: string }).message || fallback;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as any).message === 'string'
  ) {
    return (error as any).message;
  }

  return fallback;
};
