# Arduino LCD Integration

This directory contains the Arduino sketch for the OpenHeart LCD display.

## Hardware Requirements

- **Arduino Uno R4** (or compatible)
- **Grove Base Shield** (for Arduino)
- **Grove LCD RGB Backlight v4.0**

## Setup Instructions

### 1. Install Arduino IDE

Download from: https://www.arduino.cc/en/software

### 2. Install Required Libraries

Open Arduino IDE and install these libraries via Library Manager (Sketch → Include Library → Manage Libraries):

- **Grove LCD RGB Backlight** by Seeed Studio

### 3. Upload the Sketch

1. Open `OpenHeartLCD.ino` in Arduino IDE
2. Connect your Arduino via USB
3. Select your board: **Tools → Board → Arduino Uno R4 WiFi** (or your model)
4. Select the port: **Tools → Port → COM8** (or your Arduino's port)
5. Click **Upload** (→ button)
6. **Close Arduino IDE** after upload completes

### 4. Verify It Works

After uploading:
- The LCD should display "Waiting for Love..."
- The backlight should be white

If the LCD is blank:
- Check that the Grove Base Shield is properly seated
- Check that the LCD is connected to an I2C port on the shield
- Try re-uploading the sketch

## How It Works

The Arduino listens for serial commands from the Python backend:

| Command | Action | Display |
|---------|--------|---------|
| `L` or `l` | Like/Match | Pink backlight, hearts ❤️❤️❤️, "It's a Match!" |
| `D` or `d` | Skip/Dislike | Black backlight, X's ❌❌, "SKIP" |

**Communication:**
- **Baud rate:** 9600
- **Port:** Determined by backend (usually COM8 on Windows)
- **Protocol:** Single ASCII character commands

## Troubleshooting

### LCD shows nothing
- Re-upload the sketch
- Check hardware connections
- Consult `HARDWARE_DOCS.md` for additional hardware wiring and testing tips

### Backend can't connect
- Close Arduino IDE (especially Serial Monitor!)
- Unplug and replug Arduino
- Check COM port in backend `.env` file

### Commands not working
- Make sure Arduino IDE is closed
- Verify backend is running (`python app.py`)
- Check backend logs for "Successfully sent command"

## Customization

You can customize the display by editing `OpenHeartLCD.ino`:

- **Colors:** Edit `colorLike[]`, `colorSkip[]`, `colorIdle[]` arrays
- **Messages:** Edit text in `displayLike()`, `displaySkip()`, `resetScreen()`
- **Icons:** Edit `heartIcon[]` and `crossIcon[]` arrays (5x8 pixel bitmaps)
- **Timing:** Edit `delay()` values in display functions

## Important Notes

⚠️ **The Arduino code stays on the Arduino permanently after upload** - you don't need to keep Arduino IDE open!

⚠️ **You cannot use Serial Monitor and the backend at the same time** - they both use the same COM port!

⚠️ **Always close Arduino IDE before starting the backend** - otherwise you'll get "Access Denied" errors
