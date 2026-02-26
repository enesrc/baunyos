"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export default function RichTextEditor({
    name,
    defaultValue,
}: {
    name: string;
    defaultValue?: string;
}) {
    const editor = useEditor({
        extensions: [StarterKit, Link.configure({ openOnClick: false })],
        content: defaultValue ?? "",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const input = document.querySelector<HTMLInputElement>(
                `input[name="${name}"]`
            );
            if (input) input.value = editor.getHTML();
        },
    });

    return (
        <div className="rounded-lg border border-border">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 border-b border-border p-2">
                {[
                    { label: "B", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") },
                    { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") },
                    { label: "H1", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), active: editor?.isActive("heading", { level: 1 }) },
                    { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
                    { label: "• Liste", action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive("bulletList") },
                    { label: "1. Liste", action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive("orderedList") },
                ].map((btn) => (
                    <button
                        key={btn.label}
                        type="button"
                        onClick={btn.action}
                        className={`rounded px-2 py-1 text-xs font-medium transition ${btn.active
                                ? "bg-accent text-white"
                                : "bg-surface1 opacity-70 hover:opacity-100"
                            }`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* Editör */}
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-4 focus:outline-none"
            />

            {/* Hidden input — form submit için */}
            <input
                type="hidden"
                name={name}
                value={editor?.getHTML() ?? ""}
            />
        </div>
    );
}