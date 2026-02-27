"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type Props = React.ComponentProps<typeof ReactQuill> & {
  forwardedRef: React.RefObject<ReactQuill | null>;
};

export default function QuillWrapper({ forwardedRef, ...props }: Props) {
  return <ReactQuill ref={forwardedRef} {...props} />;
}