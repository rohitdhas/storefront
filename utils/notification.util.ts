export const notify = (
  data: {
    title: string;
    message: string;
    type: string;
  },
  toastRef: any
) => {
  const { title, message, type } = data;

  toastRef.current.show({
    severity: type,
    summary: title,
    detail: message,
  });
};
