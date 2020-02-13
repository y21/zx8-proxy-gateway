import HttpHandler from "./Http";
import GatewayHandler from "./Gateway";
const config = require("../configs/config");

(async () => {
    const http = new HttpHandler(config.port);
    const gateway = new GatewayHandler(http.server);
    gateway.init();
    console.log(`Webserver running on port ${config.port}`);
})();