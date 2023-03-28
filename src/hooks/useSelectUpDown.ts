import React from "react";

export default function useSelectUpDown(
  ref: React.RefObject<HTMLSelectElement>
) {
  // options utils
  function moveUp() {
    if (ref.current && ref.current?.options !== null) {
      const selected = [];

      for (let i = 0, iLen = ref.current.options.length; i < iLen; i++) {
        if (ref.current.options[i].selected) {
          selected.push(ref.current.options[i]);
        }
      }

      for (let i = 0, iLen = selected.length; i < iLen; i++) {
        let index = selected[i].index;

        if (index == 0) {
          break;
        }

        let temp = selected[i].text;
        selected[i].text = ref.current.options[index - 1].text;
        ref.current.options[index - 1].text = temp;

        temp = selected[i].value;
        selected[i].value = ref.current.options[index - 1].value;
        ref.current.options[index - 1].value = temp;

        selected[i].selected = false;
        ref.current.options[index - 1].selected = true;
      }
    }
  }

  function moveDown() {
    if (ref.current && ref.current?.options !== null) {
      const selected = [];

      for (let i = 0, iLen = ref.current.options.length; i < iLen; i++) {
        if (ref.current.options[i].selected) {
          selected.push(ref.current.options[i]);
        }
      }

      for (let i = selected.length - 1, iLen = 0; i >= iLen; i--) {
        const index = selected[i].index;

        if (index == ref.current.options.length - 1) {
          break;
        }

        let temp = selected[i].text;
        selected[i].text = ref.current.options[index + 1].text;
        ref.current.options[index + 1].text = temp;

        temp = selected[i].value;
        selected[i].value = ref.current.options[index + 1].value;
        ref.current.options[index + 1].value = temp;

        selected[i].selected = false;
        ref.current.options[index + 1].selected = true;
      }
    }
  }

  function getAllOption() {
    const options: string[] = [];
    if (ref.current) {
      for (let index = 0; index < ref.current.options.length; index++) {
        const { value } = ref.current.options[index];
        options.push(value);
      }
      return options;
    }
    return options;
  }

  return { moveUp, moveDown, getAllOption };
}
