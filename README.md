# Pollen 🌿

Pollen is a beautiful, minimalist peer-to-peer file sharing application that makes sending files feel as natural as seeds drifting in the wind.

![Pollen Preview](https://github.com/Aryan-Shan/Pollen/raw/main/preview.png) *(Note: Add your own preview screenshot here)*

## ✨ Features

- **Direct P2P Sharing**: Files are transferred directly between browsers using [PeerJS](https://peerjs.com/). No central server stores your data.
- **Dandelion Animation**: 
  - **Sending**: Seeds fly away from your dandelion to the right as files are shared.
  - **Receiving**: Yellow blossom seeds drift in from the left and attach to your dandelion as you receive "pollen."
- **QR Code Connectivity**: Easily connect by scanning a peer's identity QR code.
- **Glassmorphism UI**: A modern, nature-inspired design with elegant transparency and animations.
- **Privacy First**: Secure, encrypted data channels for reliable file transfers.

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).
- A basic web server (optional, but recommended for local testing).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aryan-Shan/Pollen.git
   cd Pollen
   ```

2. **Open the application**:
   - Simply open `index.html` in your browser.
   - **Note**: For QR code scanning to work (camera access), you should ideally serve the files through a local server (e.g., `npx serve` or Live Server in VS Code).

## 🛠️ Tech Stack

- **Core**: Vanilla HTML5, CSS3, JavaScript.
- **P2P Engine**: PeerJS (WebRTC).
- **QR Code**: qrcode.js & html5-qrcode.
- **Design**: Modern CSS with CSS Variables and Keyframe Animations.

## 📁 Project Structure

```text
Pollen/
├── components/
│   ├── dandelion.js     # DOM-based dandelion particle system
│   ├── peer-manager.js  # PeerJS connection & chunked transfer logic
│   └── ui-controller.js # UI state & list management
├── utils/
│   ├── id-generator.js  # Nature-themed peer ID generator
│   └── qr-manager.js    # QR code generation & scanning
├── app.js               # Main application orchestrator
├── style.css            # Styling and animations
└── index.html           # Main entry point
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ for a more natural web.*
