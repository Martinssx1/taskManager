import { useContext, createContext } from "react";

export const context = createContext(undefined);
export function useTaskContext() {
  const taskContext = useContext(context);
  if (taskContext === undefined) {
    throw new Error("useContext must be used within a Context");
  }
  return taskContext;
}
