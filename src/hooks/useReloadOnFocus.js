import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useReloadOnFocus(load) {
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
}
