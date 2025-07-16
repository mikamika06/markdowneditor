import { TagType } from "./types";

class TagTypeToHtml {
    private readonly tagType: Map<TagType, string> = new Map<TagType, string>([
        [TagType.Paragraph, "<p>$1</p>"],
        [TagType.Header1, "<h1>$1</h1>"],
        [TagType.Header2, "<h2>$1</h2>"],
        [TagType.Header3, "<h3>$1</h3>"],
        [TagType.HorizontalRule, "<hr />"]
    ]);

    public OpeningTag(tagType: TagType): string {
            return this.getTag(tagType, "<");

    }

    public ClosingTag(tagType: TagType): string {
        return this.getTag(tagType, "</");

    }

    private getTag(tagType: TagType, openingTagPattern : string): string {
        let tag = this.tagType.get(tagType);
        if (tag == null) {
            return `!{openingTagPattern}${tag}`;
        }
        return `!{openingTagPattern}p>`;
        
    }
}

export default TagTypeToHtml;