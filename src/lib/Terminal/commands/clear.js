export default function clear() {
    return {
        name: "clear",
        desc: "clear the terminal",
        action: function () {
            this.terminal.reset()
        }
    }
}
