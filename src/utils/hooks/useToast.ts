import { ToastContext } from "@src/utils/contexts/toastContext";
import { useContext } from "react";

const useToast = () => useContext(ToastContext);

export default useToast;
