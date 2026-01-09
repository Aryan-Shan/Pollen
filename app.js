import { IDGenerator } from './utils/id-generator.js';
import { PeerManager } from './components/peer-manager.js';
import { Dandelion } from './components/dandelion.js';
import { UIController } from './components/ui-controller.js';
import { QRManager } from './utils/qr-manager.js';

class PollenApp {
    constructor() {
        this.idGenerator = new IDGenerator();
        this.ui = new UIController(this);
        // Pass the container element, not canvas
        this.dandelion = new Dandelion(document.getElementById('dandelion-container'));

        // Generate Identity
        const myId = this.idGenerator.generate();
        this.ui.displayMyId(myId);

        // Initialize Peer
        this.peerManager = new PeerManager(myId, this);

        // Initialize QR
        this.qrManager = new QRManager();
        this.qrManager.generate(myId, document.getElementById('qrcode-container'));

        this.setupEventListeners();
        this.dandelion.init();
        this.dandelion.setMode('idle'); // Initial state
    }

    setupEventListeners() {
        // Connect button
        document.getElementById('connect-btn').addEventListener('click', () => {
            const remoteId = document.getElementById('remote-peer-id-input').value;
            if (remoteId) {
                this.peerManager.connect(remoteId);
            }
        });

        // Copy ID
        document.getElementById('copy-id-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(this.peerManager.peerId);
            // TODO: show toast
        });

        // Others...
        document.getElementById('scan-qr-btn').addEventListener('click', () => {
            const modal = document.getElementById('camera-modal');
            modal.classList.remove('hidden');

            // We need a specific ID for the library, which is 'qr-reader' usually or we pass the ID.
            // In index.html we have 'qr-video' but Html5Qrcode scanner often wants a div container or video ID.
            // Let's assume we pass "qr-video-container" if we create one, or just "qr-video" if using direct video element scanning (supported in newer versions).
            // Actually Html5Qrcode constructor takes element ID.
            // We need to modify index.html to have a div for it, not just video.

            // Let's dynamically create a div inside modal content if needed, or use an existing one.
            // For now let's assume index.html needs a slight tweak or we use the existing one differently.
            // Note: Html5Qrcode(elementId) replaces the element content.
            // Let's create a dedicated div in the modal.

            let readerDiv = document.getElementById('qr-reader');
            if (!readerDiv) {
                readerDiv = document.createElement('div');
                readerDiv.id = 'qr-reader';
                readerDiv.style.width = '100%';
                document.querySelector('.modal-content').insertBefore(readerDiv, document.getElementById('qr-video'));
                document.getElementById('qr-video').style.display = 'none'; // Hide the raw video
            }

            this.qrManager.startScanning('qr-reader', (scannedId) => {
                modal.classList.add('hidden');
                document.getElementById('remote-peer-id-input').value = scannedId;
                this.peerManager.connect(scannedId);
            });
        });

        document.getElementById('close-camera-btn').addEventListener('click', () => {
            document.getElementById('camera-modal').classList.add('hidden');
            // TODO: Stop scanner if running (need to store instance)
            location.reload(); // Brute force stop for prototype to clear camera lock
        });

        document.getElementById('share-file-btn').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
    }

    onPeerConnected(conn) {
        console.log('Connected to:', conn.peer);
        this.ui.showConnectedState(conn.peer);
        this.dandelion.setMode('connecting');
        setTimeout(() => this.dandelion.setMode('idle'), 2000);
    }

    onPeerDisconnected() {
        this.ui.resetConnectionState();
        this.dandelion.setMode('idle');
    }

    onPeerData(data) {
        // Handled by PeerManager internally, which calls onTransfer* methods
    }

    sendFiles(files) {
        Array.from(files).forEach(file => {
            this.peerManager.sendFile(file);
        });
    }

    onTransferStart(meta, type) { // type: 'send' | 'receive'
        this.dandelion.setMode(type);
        this.ui.addTransferItem(meta, type);
    }

    onTransferProgress(progress, type) { // type: 'send' | 'receive'
        // For multi-file, we'd need a more robust mapping. For single-file prototype:
        const currentMeta = this.peerManager.incomingFile.meta || { name: 'Active Transfer' };
        this.ui.updateProgress(currentMeta, progress);

        this.dandelion.updateProgress(progress);
    }

    onTransferComplete(blob, meta) {
        this.dandelion.setMode('idle');
        this.ui.markTransferComplete(meta, blob);
    }
}

// Start App
window.addEventListener('DOMContentLoaded', () => {
    window.app = new PollenApp();
});
