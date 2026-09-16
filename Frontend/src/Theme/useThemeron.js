import { useContext } from "react";
import { themeContext } from "./Theme";

export function useThemeron() {
  const themejudge = useContext(themeContext);
  if (themejudge === undefined) {
    throw new Error("check for provider");
  }
  return themejudge;
}
