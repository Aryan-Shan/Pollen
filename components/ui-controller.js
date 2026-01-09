export class UIController {
    constructor(app) {
        this.app = app;
        this.els = {
            myId: document.getElementById('my-peer-id'),
            connectionStatus: document.getElementById('connection-status'),
            connectionPanel: document.getElementById('connection-panel'),
            transferPanel: document.getElementById('transfer-panel'),
            transfersList: document.getElementById('transfers-list'),
            receivedList: document.getElementById('received-list'),
            dropZone: document.getElementById('drop-zone'),
            fileInput: document.getElementById('file-input')
        };

        this.setupFileHandlers();
    }

    displayMyId(id) {
        this.els.myId.textContent = id;
    }

    showConnectedState(peerId) {
        this.els.connectionStatus.classList.remove('hidden');
        this.els.connectionStatus.innerHTML = `<span class="status-dot connected"></span> Connected to <strong>${peerId}</strong>`;
        this.els.connectionStatus.querySelector('.status-dot').style.backgroundColor = '#015238';

        // Show transfer panels
        this.els.transferPanel.classList.remove('hidden');
    }

    resetConnectionState() {
        this.els.connectionStatus.classList.add('hidden');
        this.els.transferPanel.classList.add('hidden');
        document.getElementById('received-panel').classList.add('hidden');
        this.els.transfersList.innerHTML = '';
        alert('Peer disconnected');
    }

    setupFileHandlers() {
        // Click to upload
        this.els.dropZone.addEventListener('click', () => this.els.fileInput.click());

        this.els.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.app.sendFiles(e.target.files);
            }
        });

        // Drag and Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.els.dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.els.dropZone.addEventListener('dragenter', () => this.els.dropZone.classList.add('highlight'));
        this.els.dropZone.addEventListener('dragleave', () => this.els.dropZone.classList.remove('highlight'));

        this.els.dropZone.addEventListener('drop', (e) => {
            this.els.dropZone.classList.remove('highlight');
            const files = e.dataTransfer.files;
            if (files.length) {
                this.app.sendFiles(files);
            }
        });
    }

    // Transfer UI
    addTransferItem(meta, type) { // type: 'send' | 'receive'
        const div = document.createElement('div');
        div.className = 'transfer-item';
        div.id = `transfer-${meta.name.replace(/\s+/g, '-')}`; // simple ID

        const icon = type === 'send' ? '↑' : '↓';

        div.innerHTML = `
            <div class="file-icon">${icon}</div>
            <div class="file-info">
                <div class="file-name">${meta.name}</div>
                <div class="file-size">${this.formatBytes(meta.size)}</div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar"></div>
            </div>
        `;

        this.els.transfersList.prepend(div);
        return div;
    }

    updateProgress(meta, progress) {
        const id = `transfer-${meta.name.replace(/\s+/g, '-')}`;
        const el = document.getElementById(id);
        if (el) {
            const bar = el.querySelector('.progress-bar');
            bar.style.width = `${progress * 100}%`;
        }
    }

    markTransferComplete(meta, blob) {
        const id = `transfer-${meta.name.replace(/\s+/g, '-')}`;
        const el = document.getElementById(id);
        if (el) {
            // Remove progress bar for completed items
            const barContainer = el.querySelector('.progress-bar-container');
            if (barContainer) barContainer.remove();

            if (blob) {
                // It was a receive. Move to received list.
                el.classList.add('received-item');
                document.getElementById('received-panel').classList.remove('hidden');

                // Add download button (manual trigger)
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = meta.name;
                link.className = 'btn primary-btn download-btn';
                link.innerHTML = 'Download';
                el.appendChild(link);

                this.els.receivedList.prepend(el);
            } else {
                // It was a send. Just show completion status or remove?
                // Let's keep it in active list but mark as "Sent"
                el.querySelector('.file-info').innerHTML += '<div class="sent-label">Sent</div>';
                setTimeout(() => el.remove(), 5000); // Remove sent items after 5s
            }
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(msg) {
        alert(msg);
    }
}
