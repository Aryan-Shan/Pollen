export class PeerManager {
    constructor(peerId, app) {
        this.app = app;
        this.peerId = peerId;
        this.peer = null;
        this.conn = null;

        // Transfer state
        this.incomingFile = {
            buffer: [],
            receivedSize: 0,
            meta: null
        };

        this.init();
    }

    init() {
        // Peer configuration as requested
        this.peer = new Peer(this.peerId, {
            host: '0.peerjs.com',
            port: 443,
            path: '/',
            secure: true,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ]
            }
        });

        this.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });

        this.peer.on('connection', (conn) => {
            this.handleConnection(conn);
        });

        this.peer.on('error', (err) => {
            console.error('Peer error:', err);
            alert('Connection Error: ' + err.type);
        });
    }

    connect(remoteId) {
        if (!this.peer) return;
        if (this.conn) this.conn.close(); // Close existing

        console.log('Connecting to', remoteId);
        const conn = this.peer.connect(remoteId, {
            reliable: true
        });
        this.handleConnection(conn);
    }

    handleConnection(conn) {
        if (this.conn && this.conn.peer !== conn.peer) {
            this.conn.close(); // Only one connection at a time for this simplified app
        }

        this.conn = conn;

        conn.on('open', () => {
            console.log('Connection open with:', conn.peer);
            this.app.onPeerConnected(conn);
        });

        conn.on('data', (data) => {
            this.handleData(data);
        });

        conn.on('close', () => {
            console.log('Connection closed with:', conn.peer);
            this.app.onPeerDisconnected();
            this.conn = null;
        });

        conn.on('error', (err) => {
            console.error('Connection error:', err);
            this.app.onPeerDisconnected();
        });
    }

    handleData(data) {
        // Validation
        if (!data || !data.type) return;

        if (data.type === 'meta') {
            console.log('Incoming file meta:', data);
            this.incomingFile = {
                buffer: [],
                receivedSize: 0,
                meta: data
            };
            this.app.onTransferStart(data, 'receive');

        } else if (data.type === 'chunk') {
            if (!this.incomingFile.meta) return;

            this.incomingFile.buffer.push(data.data);
            this.incomingFile.receivedSize += data.data.byteLength;

            // Progress throttled by frames usually, but we call on every chunk here
            const progress = this.incomingFile.receivedSize / this.incomingFile.meta.size;
            this.app.onTransferProgress(progress, 'receive');

        } else if (data.type === 'end') {
            if (!this.incomingFile.meta) return;

            console.log('File transfer complete');
            const blob = new Blob(this.incomingFile.buffer, { type: this.incomingFile.meta.mime });
            this.app.onTransferComplete(blob, this.incomingFile.meta);

            // Reset for next file
            this.incomingFile = { buffer: [], receivedSize: 0, meta: null };
        }
    }

    async sendFile(file) {
        if (!this.conn || !this.conn.open) {
            alert('No peer connected!');
            return;
        }

        console.log('Sending file:', file.name, file.size);

        // Send Metadata
        this.conn.send({
            type: 'meta',
            name: file.name,
            size: file.size,
            mime: file.type
        });

        // We notify app of our OWN send start
        this.app.onTransferStart({ name: file.name, size: file.size }, 'send');

        // Chunking with slightly larger buffer for efficiency if reliable
        const chunkSize = 64 * 1024; // 64KB chunks
        let offset = 0;

        const readSlice = () => {
            if (!this.conn || !this.conn.open) return;

            const slice = file.slice(offset, offset + chunkSize);
            const reader = new FileReader();

            reader.onload = (e) => {
                this.conn.send({
                    type: 'chunk',
                    data: e.target.result
                });

                offset += slice.size;

                // Progress
                const progress = offset / file.size;
                this.app.onTransferProgress(progress, 'send');

                if (offset < file.size) {
                    // Small delay to prevent blocking UI/signaling? 
                    // PeerJS handles backpressure internally mostly, but let's be safe.
                    setTimeout(readSlice, 0);
                } else {
                    this.conn.send({ type: 'end' });
                    this.app.onTransferComplete(null, { name: file.name });
                }
            };

            reader.readAsArrayBuffer(slice);
        };

        readSlice();
    }
}
