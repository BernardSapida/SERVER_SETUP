export const getMessage = (
  { request, response }: { request: any; response: any },
) => {
  try {
    response.body = { success: true, message: "You are in feed page!" };
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};
