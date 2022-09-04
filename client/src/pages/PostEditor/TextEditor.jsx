import React, { useCallback, useMemo } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const TextEditor = ({ name, value, handleChange, maxHeight = "45vh" }) => {
  const onChange = useCallback(
    (value) => {
      handleChange({ target: { name, value } });
    },
    [handleChange, name]
  );

  const customOptions = useMemo(
    () => ({
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "table",
        "|",
        "link",
        "image",
        "|",
        "horizontal-rule",
        "code",
        "|",
        "undo",
        "redo",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "guide",
      ],
      shortcuts: {
        toggleBold: "Ctrl-B",
        toggleItalic: "Ctrl-I",
        toggleStrikethrough: "Ctrl-S",
        toggleBlockquote: "Ctrl-Q",
        toggleUnorderedList: "Ctrl-Alt-U",
        toggleOrderedList: "Ctrl-Alt-O",
        toggleHeadingSmaller: "Ctrl-Alt-H",
        toggleHeadingBigger: "Ctrl-Alt-Shift-H",
        drawLink: "Ctrl-K",
        drawImage: "Ctrl-Alt-I",
        drawTable: "Ctrl-Alt-T",
        drawHorizontalRule: "Ctrl-Alt-H",
        undo: "Ctrl-Z",
        redo: "Ctrl-Y",
        togglePreview: "Ctrl-P",
        toggleFullScreen: "Ctrl-Alt-*",
      },
      spellChecker: false,
      promptURLs: true,
      minHeight: "100px",
      maxHeight: maxHeight,
      sideBySideFullscreen: true,
      previewImagesInEditor: false,
    }),
    [maxHeight]
  );

  return (
    <SimpleMDE value={value} onChange={onChange} options={customOptions} />
  );
};

export default TextEditor;
