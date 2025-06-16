import { useMutation } from "@tanstack/react-query";
import contactForm from "../services/ContactForm/contactForm";
import { toast } from "react-toastify";

const useContactForm = () => {
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (formData) => contactForm(formData),
    onSuccess: () => {
      toast.success("تم ارسال رسالتك بنجاح");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إرسال الرسالة"
      );
    },
  });

  return { mutate, isLoading, isError, error };
};

export default useContactForm;
