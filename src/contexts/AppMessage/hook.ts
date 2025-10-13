import { useContext } from "react";
import AppMessageContext from ".";

export const useAppMessage = () => { 
    const messageApi = useContext(AppMessageContext);
    if (!messageApi) {
        throw new Error("useAppMessage must be used within a AppMessageProvider");
    }
    return messageApi;
}