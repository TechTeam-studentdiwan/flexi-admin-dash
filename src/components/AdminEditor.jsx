import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { useRef } from "react";

const ToolbarButton = ({ onClick, active, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 py-1 rounded font-semibold border transition ${
      active
        ? "bg-purple-600 text-white"
        : "bg-white hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const RichTextEditor = ({
  value = "",
  onChange,
  readOnly = false,
  minHeight = 200,
}) => {
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: false,
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result })
        .run();
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addImage(file);
  };

  return (
    <div className="border rounded-md bg-white">
      
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex gap-2 p-2 border-b bg-gray-50 flex-wrap">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          >
            <b>B</b>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          >
            <i>I</i>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
          >
            <u>U</u>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          >
            • List
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
          >
            H2
          </ToolbarButton>

          {/* Image Button */}
          <ToolbarButton
            onClick={() => fileInputRef.current.click()}
          >
            🖼
          </ToolbarButton>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-3 focus:outline-none"
        style={{ minHeight }}
      />
    </div>
  );
};

export default RichTextEditor;
