import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { createContext } from "react";

const AppMessageContext = createContext<MessageInstance | null>(null);

export function AppMessageProvider({ children }: { children: React.ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <AppMessageContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </AppMessageContext.Provider>
  );
}

export default AppMessageContext;

