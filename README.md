# RFID Attendance System

![RFID Attendance System Logo](public/attendance-icon.svg)

> A modern, responsive web application for real-time attendance tracking using RFID technology

[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-0.7-000000?style=flat)](https://ui.shadcn.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat&logo=socket.io)](https://socket.io/)
[![Arduino](https://img.shields.io/badge/Arduino-Compatible-00979D?style=flat&logo=arduino)](https://www.arduino.cc/)

## ✨ Features

- **Real-time Attendance Tracking**: Instantly logs student attendance as RFID cards are scanned
- **Modern UI**: Clean, responsive interface powered by shadcn/ui components and Tailwind CSS
- **Light/Dark Mode**: Automatic theme detection with manual toggle option
- **Data Export**: Download attendance records as CSV with a single click
- **Dashboard**: At-a-glance statistics showing total check-ins and unique students
- **Auto-Connect**: Automatically connects to RFID reader when available
- **Persistent Connection**: Maintains stable connection to the RFID hardware

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building the interface
- **Vite**: Fast, modern frontend build tool
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality components built with Radix UI
- **Socket.io Client**: Real-time communication with the backend

### Backend
- **Node.js**: JavaScript runtime for the server
- **SerialPort**: Communication with Arduino/RFID hardware
- **Socket.io**: Real-time bidirectional communication

### Hardware
- **Arduino**: Microcontroller running the RFID scanner code
- **MFRC522**: RFID reader module
- **Additional Components**: Ultrasonic sensor, buzzer, LCD display

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Arduino IDE (for uploading code to the hardware)
- Arduino with RFID reader connected to your computer
- Arduino libraries:
  - [MFRC522 Library](https://github.com/miguelbalboa/rfid) - For RFID communication
  - [LiquidCrystal I2C Library](https://github.com/fdebrabander/Arduino-LiquidCrystal-I2C-library) - For LCD display
  - SPI - For communication with RFID reader

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MPCA_proj.git
   cd MPCA_proj/website
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Install Arduino libraries**
   - Open Arduino IDE
   - Go to Tools > Manage Libraries...
   - Search for and install the following libraries:
     - MFRC522 (by Miguel Balboa)
     - LiquidCrystal I2C (by Frank de Brabander)
   - Or install manually from GitHub:
     ```bash
     cd ~/Documents/Arduino/libraries
     git clone https://github.com/miguelbalboa/rfid.git MFRC522
     git clone https://github.com/fdebrabander/Arduino-LiquidCrystal-I2C-library.git LiquidCrystal_I2C
     ```

### Running the Application

1. **Start the backend server**
   ```bash
   npm run server
   ```
   This will start the server that communicates with the RFID hardware.

2. **In a new terminal, start the frontend development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173` to access the application.

## 📖 Usage

1. **Connect the Hardware**: Connect your Arduino with the RFID reader to your computer via USB

2. **Start the Application**: Run both the backend server and frontend development server

3. **Connect to the RFID Reader**:
   - The application will automatically attempt to connect to `/dev/cu.usbserial-1110`
   - If needed, select a different port from the dropdown
   - Click "Connect Device" if it doesn't connect automatically

4. **Record Attendance**:
   - When students scan their RFID cards, their information will appear in the Attendance Log
   - The dashboard will update with current statistics
   
5. **Export Data**:
   - Click the "Export Attendance Data" button to download a CSV file
   - The CSV includes student names, IDs, and timestamps

## 🔌 Hardware Setup

### Components Required
- Arduino Uno/Nano
- MFRC522 RFID reader
- RFID cards/tags (Mifare Classic 1K recommended)
- Ultrasonic sensor HC-SR04 (for proximity detection)
- Buzzer (for audio feedback)
- I2C LCD display (16x2)
- Jumper wires and breadboard

### Connection Diagram


### Detailed Pin Connections

| Arduino Pin | Connected To        | Description                        |
|-------------|---------------------|------------------------------------|
| 5V          | MFRC522 VCC, HC-SR04 VCC, LCD VCC | Power supply (5V)   |
| GND         | MFRC522 GND, HC-SR04 GND, LCD GND, Buzzer GND | Ground  |
| 13 (SCK)    | MFRC522 SCK        | SPI Clock                          |
| 12 (MISO)   | MFRC522 MISO       | SPI Master Input Slave Output      |
| 11 (MOSI)   | MFRC522 MOSI       | SPI Master Output Slave Input      |
| 10 (SS)     | MFRC522 SDA        | SPI Slave Select                   |
| 9           | MFRC522 RST        | Reset                              |
| A4 (SDA)    | LCD SDA            | I2C Data                           |
| A5 (SCL)    | LCD SCL            | I2C Clock                          |
| 6           | HC-SR04 TRIG       | Ultrasonic Trigger                 |
| 5           | HC-SR04 ECHO       | Ultrasonic Echo                    |
| 3           | Buzzer Positive    | Buzzer Control                     |

## Building for Production

To create a production-ready build of the application, follow these steps:

1. **Build the frontend**:
   ```bash
   cd /Users/karanm/Desktop/4th\ Sem/MPCA/MPCA_proj/website
   npm run build
   ```

## 🙏 Acknowledgements

This project would not have been possible without the contributions of:

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful, accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Socket.io](https://socket.io/) for real-time communication
- [SerialPort](https://serialport.io/) for Node.js serial port access
- [MFRC522 Library](https://github.com/miguelbalboa/rfid) by Miguel Balboa for Arduino RFID functionality
- [Lucide React](https://lucide.dev/icons/) for the icon set
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend framework

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Developed as part of the Microprocessors and Computer Architecture (MPCA) course project.*

