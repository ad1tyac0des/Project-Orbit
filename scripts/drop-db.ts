import { connectDB } from "../src/memory/db";

// WARNING: HIGH VOLTAGE CURRENT GOING THROUGH THIS FUNCTION, USE WITH CAUTION~
function dropTable() {
    const db = connectDB();
    try {
        const confirm = prompt("Confirm deleting memories? (y/n):");
        if (confirm?.toLowerCase() !== "y") {
            console.log("\nOperation cancelled. Memories are safe.");
            return;
        }
        const confirmAgain = prompt(`
            🚨 LAST CHANCE 🚨

    Future you might hate present you.

    Delete memories forever? (y/n):`);
        if (confirmAgain?.toLowerCase() !== "y") {
            console.log("\n❤️  Wise choice! Memories' lives matter too.");
            return;
        }
        db.run(`DROP TABLE IF EXISTS memories`);
        console.log("\nMemories DELETED successfully.");
    } finally {
        db.close();
    }
}

dropTable();
