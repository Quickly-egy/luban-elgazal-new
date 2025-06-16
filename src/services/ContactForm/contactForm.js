import api from "../api";

const contactForm = async (formData) => {
  const response = await api.post("/contact-forms", formData);
  return response.data;
};

export default contactForm;
