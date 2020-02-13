import http  from "http";
import ws from "ws";
import fetch, {Response} from "node-fetch";

const urlRegex = /https?:\/\/[\w-\.]+\/[^"'<>()\[\]\{\}\s]+/g;
const domainRegex = /https?:\/\/(?:[\w\-]+\.)+\w+/g;

enum ProxyEvents {
    Response = 0
}

export default class GatewayHandler {
    public http: http.Server;
    public gateway?: ws.Server;
    public connection?: ws;

    constructor(server: http.Server) {
        this.http = server;
    }

    public init(): void {
        this.gateway = new ws.Server({
            server: this.http
        });

        this.gateway.on("error", console.error);
        this.gateway.on("connection", (connection: ws) => {
            console.log("New connection");
            this.connection = connection;
            connection.on("message", (data: any) => this.handleMessage(data));
        });
    }

    public async handleMessage(message: string) {
        if (!this.connection) {
            return;
        }
        const timestamp: number = Date.now();
        let request: Response;
        try {
            request = await fetch(message, {
                headers: {
                    "User-Agent": "zx8 indexer"
                },
                timeout: 5000
            });
        } catch(e) {
            console.log("Failed to index %s: %s", message, e.message);
            return;
        }

        const entry = {
            host: (message.match(domainRegex) || [])[0],
            url: message,
            status: request.status,
            headers: JSON.stringify(request.headers.raw()),
            responseTime: Date.now() - timestamp,
            urls: <string[]>[]
        };

        const body = await request.text();
        if (body.length >= 3000000) {
            return;
        }
        const urls = body.match(urlRegex);
        if (urls) {
            entry.urls = urls;
        }

        this.connection.send(JSON.stringify({
            t: ProxyEvents.Response,
            d: entry
        }));
    }
}