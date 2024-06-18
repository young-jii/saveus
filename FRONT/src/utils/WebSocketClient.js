export default class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.isConnected = false;
        this.messageQueue = [];
    }

    connect() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            this.isConnected = true;
            // 연결 후 메시지 큐에 있는 메시지를 전송
            while (this.messageQueue.length > 0) {
                this.socket.send(JSON.stringify(this.messageQueue.shift()));
            }
        };
        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
            this.isConnected = false;
        };
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    send(data) {
        if (this.isConnected) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not open. Queuing message.');
            this.messageQueue.push(data);
        }
    }

    onMessage(callback) {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                callback(data);
            };
        } else {
            console.error('WebSocket is not initialized.');
        }
    }
}
