import { useQuery } from "@tanstack/react-query";
import about from "../services/ContactForm/about";

const useAbout = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["about"],
    queryFn: about,
  });
  return { data, isLoading, isError }
};

export default useAbout;
