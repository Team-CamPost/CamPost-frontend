import { useEffect } from "react";

/**
 * enabled가 true인 동안 Esc 키를 누르면 onEscape를 호출한다. (모달 닫기용)
 */
export const useEscapeKey = (onEscape: () => void, enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEscape, enabled]);
};
