"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlHandler = void 0;
class HtmlHandler {
    TextChanger(id, output) {
        let markdown = document.getElementById(id);
        let markdownOutput = document.getElementById(output);
        if (markdown !== null) {
            markdown.onkeyup = (e) => {
                if (markdown.value) {
                    markdownOutput.innerHTML = markdown.value;
                }
                else {
                    markdownOutput.innerHTML = "<p></p>";
                }
            };
        }
    }
}
exports.HtmlHandler = HtmlHandler;
//# sourceMappingURL=HtmlHandler.js.map