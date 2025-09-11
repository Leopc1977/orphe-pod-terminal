export default function help() {
    return {
        name: "help",
        desc: "List available commands",
        action: function () {
            this.writeln("Available commands:");
            for (const [name, { desc }] of this.commands) {
                this.writeln(`  ${name} - ${desc}`);

            }
        }
    }
}
