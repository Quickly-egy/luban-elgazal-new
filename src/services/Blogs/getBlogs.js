import api from "../api";

const getBlogs = async () => {
  const response = await api.get("/articles");
  return response.data.data;
};
export default getBlogs;
