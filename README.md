# zx8-proxy-gateway
This is a part of the [zx8 indexer](https://github.com/y21/zx8) and is used to proxy HTTP requests.
It will run a web server on a given port (specified in config file) and waits for a websocket connection. 
The master process will try to connect to this on startup and instead of directly indexing pages, this will make the requests instead.