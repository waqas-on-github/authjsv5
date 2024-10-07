export const createResponce = <T>({
  success,
  successMesage,
  errorMessage,
  responce,
}: {
  success: boolean;
  successMesage?: string;
  errorMessage?: string;
  responce?: T;
}) => {
  return {
    success,
    data: {
      successMesage,
      responce: responce as T,
    },
    error: {
      errorMessage,
    },
  };
};
