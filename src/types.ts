enum TagType{
    Paragraph,
    Header1,
    Header2,
    Header3,
    HorizontalRule
}

interface IMarkdownDocument {
    Add(...content : string[]) : void;
    Get(): string;
}

export { TagType, IMarkdownDocument };