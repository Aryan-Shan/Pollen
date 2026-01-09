export class QRManager {
    constructor() {
        this.qrcode = null;
    }

    generate(text, container) {
        if (!container) return;

        // Clear previous
        container.innerHTML = '';

        // Using global QRCode object from script tag
        if (window.QRCode) {
            this.qrcode = new QRCode(container, {
                text: text,
                width: 128,
                height: 128,
                colorDark: "#015238",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            console.error('QRCode library not loaded');
            container.innerText = 'QR Lib Missing';
        }
    }

    async startScanning(videoElementId, onScan) {
        // Using Html5Qrcode library
        if (!window.Html5Qrcode) {
            console.error('Html5Qrcode library not loaded');
            return;
        }

        const html5QrCode = new Html5Qrcode(videoElementId);

        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText, decodedResult) => {
                    // Handle success
                    console.log(`Scan result: ${decodedText}`);
                    html5QrCode.stop().then(() => {
                        onScan(decodedText);
                    });
                },
                (errorMessage) => {
                    // parse error, ignore loop
                }
            );
            return html5QrCode; // Return instance to allow stopping later if needed
        } catch (err) {
            console.error("Error starting scanner", err);
            alert("Could not start camera. Ensure permissions are granted.");
        }
    }
}
