export const paging = (data?: { page?: number; size?: number }) => {
  const { page = 1, size = 5 } = data || { page: 1, size: 5 };
  return {
    LIMIT: size,
    OFFSET: page * size - size,
  };
};
