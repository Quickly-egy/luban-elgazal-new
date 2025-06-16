import { useQuery } from "@tanstack/react-query";
import getBlogs from "../services/Blogs/getBlogs";

const useBlog = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });
  return { data, isLoading, isError };
};

export default useBlog;