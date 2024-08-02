import { toast } from "react-toastify";

export const errorToast = (message, position, autoClose) =>
  toast.error(message, {
    position: position || "top-right",
    autoClose: autoClose || autoClose === undefined ? 10000 : autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

export const successToast = (message, position, autoClose) =>
  toast.success(message, {
    position: position || "top-right",
    autoClose: autoClose || autoClose === undefined ? 10000 : autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

export const warnToast = (message, position, autoClose) =>
  toast.warn(message, {
    position: position || "top-right",
    autoClose: autoClose || autoClose === undefined ? 10000 : autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
