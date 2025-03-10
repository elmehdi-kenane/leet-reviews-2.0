import toast from "react-hot-toast";

export const isValidImageFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    toast.error("Only image files (PNG, JPEG) are allowed!", {
      id: "Only image files (PNG, JPEG) are allowed!",
    });
    return false;
  }
  return true;
};
