module.exports = {
    htmlspecialchars: (str) => {
        if (typeof(str) == "string") {
            str = str.replace(/&/g, "&amp;");/* must do &amp; first */
            str = str.replace(/"/g, "&quot;");
            str = str.replace(/'/g, "&#039;");
            str = str.replace(/</g, "&lt;");
            str = str.replace(/>/g, "&gt;");
        }
        return str;
    },
    decodeHtml: (text) => {
        return text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/ , '<')
            .replace(/&gt;/, '>')
            .replace(/&quot;/g,'"')
            .replace(/&#039;/g,"'");
    }
}