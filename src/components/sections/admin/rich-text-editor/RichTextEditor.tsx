"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import ReactQuill from "react-quill-new";
import ImageViewer from "./ImageViewer";
import type Quill from "quill";

type QuillWrapperProps = React.ComponentProps<typeof ReactQuill> & {
    forwardedRef: React.RefObject<ReactQuill | null>;
};

const QuillEditor = dynamic(
    async () => {
        const { default: Wrapper } = await import("./QuillWrapper");
        return Wrapper;
    },
    {
        ssr: false,
        loading: () => <div className="h-64 animate-pulse rounded-b-lg bg-surface1" />,
    }
) as React.ComponentType<QuillWrapperProps>;

const TOOLBAR = [
    [{ font: [] }, { size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    ["link", "image", "video"],
    ["clean"],
];

function renderContentWithViewer(html: string) {
    const parts = html.split(/(<img[^>]*\/?>)/gi);
    return parts.map((part, i) => {
        const srcMatch = part.match(/src="([^"]+)"/i);
        const altMatch = part.match(/alt="([^"]*)"/i);
        if (srcMatch) {
            return (
                <ImageViewer
                    key={i}
                    src={srcMatch[1]}
                    alt={altMatch?.[1] ?? ""}
                    className="my-3"
                />
            );
        }
        if (part.trim()) {
            return (
                <div
                    key={i}
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: part }}
                />
            );
        }
        return null;
    });
}

export default function RichTextEditor({
    name,
    defaultValue,
}: {
    name: string;
    defaultValue?: string;
}) {
    const [value, setValue] = useState(defaultValue ?? "");
    const [bounds, setBounds] = useState<HTMLElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<ReactQuill>(null);

    useEffect(() => {
        if (containerRef.current) setBounds(containerRef.current);
    }, []);

    const getEditor = useCallback((): Quill | null => {
        return (quillRef.current?.getEditor() as Quill) ?? null;
    }, []);

    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (!res.ok) return;
            const { url } = (await res.json()) as { url: string };
            const editor = getEditor();
            if (!editor) return;
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, "image", url);
            editor.setSelection({ index: range.index + 1, length: 0 });
        };
    }, [getEditor]);

    const modules = {
        toolbar: {
            container: TOOLBAR,
            handlers: { image: imageHandler },
        },
    };

    const formats = [
        "font", "size",
        "header",
        "bold", "italic", "underline", "strike",
        "blockquote",
        "color", "background",
        "align",
        "list", "indent",
        "direction",
        "link", "image", "video",
    ];

    const hasContent = value && value !== "<p><br></p>" && value.trim() !== "";

    return (
        <div ref={containerRef} className="rounded-lg border border-border">
            <QuillEditor
                forwardedRef={quillRef}
                theme="snow"
                value={value}
                onChange={setValue}
                modules={modules}
                formats={formats}
                bounds={bounds ?? undefined}
                className="[&_.ql-container]:min-h-64 [&_.ql-container]:rounded-b-lg [&_.ql-container]:border-0 [&_.ql-container]:border-t [&_.ql-container]:border-border [&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border"
            />

            <input type="hidden" name={name} value={value} />

            {hasContent && (
                <div className="border-t border-border">
                    <div className="border-b border-border bg-surface1/30 px-3 py-1.5">
                        <span className="text-xs opacity-50">Önizleme</span>
                    </div>
                    <div className="space-y-2 p-4">
                        {renderContentWithViewer(value)}
                    </div>
                </div>
            )}
        </div>
    );
}