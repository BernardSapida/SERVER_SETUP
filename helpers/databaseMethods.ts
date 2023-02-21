import { fetchApi } from "./database.ts";

export const find = async (
  collection: string,
  options: Record<string, unknown>,
) => {
  try {
    const filter = {
      filter: {
        ...options,
      },
    };
    const response = await fetchApi("POST", "find", collection, filter);

    if (response.status === 403) {
      return response;
    }

    return response;
  } catch (error) {
    return response(true, error);
  }
};

export const response = (success: boolean, data: string) => {
  return {
    success: success,
    data: data,
  };
};
