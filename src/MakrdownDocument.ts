import { IMarkdownDocument } from "./types"; 

class MarkdownDocument implements IMarkdownDocument {
    private content: string = "";

    public Add(...content: string[]): void {
        content.forEach((element) => {
            this.content += element;
        });
    }

    public Get(): string {
        return this.content;
    }
}
