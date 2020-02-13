import http from "http";
const ey = require("ey");

export default class HttpHandler {
    public server: http.Server;

    constructor(port: number) {
        const router = ey();
        router
            .get("/", (req: http.IncomingMessage, res: http.OutgoingMessage) => {
                const { rss } = process.memoryUsage();
                res.end((rss / 1024 ** 2).toFixed(2) + " MB");
            });
        this.server = http.createServer(router).listen(port);
    }
}