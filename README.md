# Pollen

Pollen is a minimalist peer-to-peer file sharing application designed to provide a natural and intuitive user experience. By utilizing WebRTC technology, Pollen enables direct browser-to-browser file transfers without the need for intermediary servers, ensuring both privacy and efficiency.

![Pollen Preview](https://drive.google.com/uc?export=view&id=1pBJQHjuOBl5gngTU-q61oAv_T53A-ig2)

## Features

- **Direct P2P Sharing**: Leverages PeerJS and WebRTC for secure, direct data channels between users.
- **Visual Feedback System**:
  - **Sender View**: Seeds drift away from the central dandelion to indicate a file is being sent.
  - **Receiver View**: Yellow seeds arrive and attach to the dandelion to indicate incoming data.
- **QR Code Integration**: Peer connections can be established quickly by scanning identity QR codes.
- **Modern Design**: Implements a glassmorphism aesthetic with high-performance CSS animations.
- **Persistent Connection State**: Received markers remain available for the duration of the session.

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+).
- **Networking**: PeerJS (WebRTC implementation).
- **Utilities**: qrcode.js (QR generation), html5-qrcode (QR scanning).
- **Animations**: DOM-based particle system with CSS Keyframes.

## Installation and Setup

### Local Operation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aryan-Shan/Pollen.git
   cd Pollen
   ```

2. **Run a local server**:
   Due to browser security policies regarding camera access (required for QR scanning) and JavaScript modules, it is recommended to serve the project using a local web server.
   
   Using Node.js:
   ```bash
   npx serve .
   ```
   
   Alternatively, use the "Live Server" extension in VS Code.

3. **Access the application**:
   Open your browser and navigate to the address provided by your local server.

### Peer Connection

To share files between two devices:
1. Open the application on both devices.
2. Share the Peer ID or QR code from one device.
3. On the second device, enter the Peer ID or scan the QR code to connect.
4. Drag and drop files or use the 'Share File' button to begin the transfer.

## Project Structure

- `components/`: Core application logic (Dandelion animation, Peer management, UI control).
- `utils/`: Helper scripts for ID generation and QR manipulation.
- `app.js`: Main entry point and application orchestration.
- `style.css`: Comprehensive design system and animation logic.
- `index.html`: Application structure.

## License

This project is licensed under the MIT License.
