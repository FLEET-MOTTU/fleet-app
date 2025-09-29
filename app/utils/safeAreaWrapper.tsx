import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeAreaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-backgroundDark"
      edges={["top", "left", "right", "bottom"]}
    >
      {children}
    </SafeAreaView>
  );
}
