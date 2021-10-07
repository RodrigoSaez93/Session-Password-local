 const fs = require("fs/promises");

class FileHandler {
    constructor() {
        this.filename = "chat.txt";
    }

    async append(text) {
        await fs.appendFile(this.filename, text, 'utf-8');
    }
}

module.exports = FileHandler;