export default class Logger {

    constructor(options) {
        this.options = options;
    }

    log(...data) {
        if (this.options.showLogs) {
            console.log(...data);
        }
    }

    warn(...data) {
        if (this.options.showLogs) {
            console.warn(...data);
        }
    }

    error(...data) {
        if (this.options.showLogs) {
            console.error(...data);
        }
    }

}