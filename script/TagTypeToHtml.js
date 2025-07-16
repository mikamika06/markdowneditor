"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class TagTypeToHtml {
    tagType = new Map([
        [types_1.TagType.Paragraph, "<p>$1</p>"],
        [types_1.TagType.Header1, "<h1>$1</h1>"],
        [types_1.TagType.Header2, "<h2>$1</h2>"],
        [types_1.TagType.Header3, "<h3>$1</h3>"],
        [types_1.TagType.HorizontalRule, "<hr />"]
    ]);
    OpeningTag(tagType) {
        return this.getTag(tagType, "<");
    }
    ClosingTag(tagType) {
        return this.getTag(tagType, "</");
    }
    getTag(tagType, openingTagPattern) {
        let tag = this.tagType.get(tagType);
        if (tag == null) {
            return `!{openingTagPattern}${tag}`;
        }
        return `!{openingTagPattern}p>`;
    }
}
exports.default = TagTypeToHtml;
//# sourceMappingURL=TagTypeToHtml.js.map