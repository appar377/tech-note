"use client";

import { Check, Copy } from "lucide-react";
import { type HTMLAttributes, useRef, useState } from "react";

export function CodeBlock(props: HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    const text = preRef.current?.textContent ?? "";
    if (!text) {
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="code-block group">
      <pre ref={preRef} {...props} />
      <button
        type="button"
        className="code-copy-button"
        onClick={copyCode}
        aria-label="コードをコピー"
        title="コードをコピー"
      >
        {copied ? <Check aria-hidden size={15} /> : <Copy aria-hidden size={15} />}
      </button>
    </div>
  );
}
