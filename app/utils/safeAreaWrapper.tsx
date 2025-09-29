import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeAreaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-backgroundDark px-4 py-4"
      edges={["top", "left", "right", "bottom"]}
    >
      {children}
    </SafeAreaView>
  );
}
