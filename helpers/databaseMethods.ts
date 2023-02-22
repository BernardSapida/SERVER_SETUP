import { MongoAPI } from "./database.ts";

export const find = async (
  collection: string,
  filter: Record<string, unknown>,
) => {
  try {
    const options = {
      filter: {
        ...filter,
      },
    };
    const response = await MongoAPI("POST", "find", collection, options);

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
