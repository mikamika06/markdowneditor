import { marked } from "marked";

export function markdownToHtml(markdown: string) {
    return marked.parse(markdown);
}