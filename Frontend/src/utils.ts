import React from "react";
import { usePopper } from "react-popper";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export function useMenu(offset?: number) {
  let [referenceElem, setReferenceElem] = React.useState();
  let [floatingElement, setFloatingElement] = React.useState();
  let { styles, attributes } = usePopper(referenceElem, floatingElement, {
    placement: "bottom-end",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, offset === undefined ? 12 : offset]
        }
      }
    ]
  });

  return {
    styles,
    attributes,
    setReferenceElem,
    setFloatingElement
  };
}
