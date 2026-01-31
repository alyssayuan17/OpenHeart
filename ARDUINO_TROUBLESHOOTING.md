# Arduino Integration Diagnostic

## Current Issue
Backend reports "Hardware not connected" when trying to send commands to Arduino.

## Steps to Fix

### 1. Stop All Python Processes
Multiple Python processes detected. Let's clean them up:

```powershell
# Stop all Python processes
Get-Process python | Stop-Process -Force
```

### 2. Close Arduino IDE
Make sure Arduino IDE is completely closed (including Serial Monitor).

### 3. Verify Arduino is Plugged In
Check that Arduino USB is connected and recognized:

```powershell
python -c "import serial.tools.list_ports; [print(f'{p.device}: {p.description}') for p in serial.tools.list_ports.comports()]"
```

You should see something like:
```
COM8: Arduino Uno (COM8)
```

### 4. Start Backend Fresh
```bash
cd backend
python app.py
```

You should see:
```
[Arduino] Using port from ARDUINO_PORT env var: COM8
[Arduino] Connected to COM8 at 9600 baud
 * Running on http://127.0.0.1:5000
```

### 5. Test Arduino Connection
Once backend is running, test in browser console:

```javascript
fetch('http://localhost:5000/api/arduino/status')
  .then(r => r.json())
  .then(console.log)
```

Should return:
```json
{
  "connected": true,
  "port": "COM8",
  "baud_rate": 9600
}
```

### 6. Test Sending Commands
```javascript
fetch('http://localhost:5000/api/arduino', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({action: 'like'})
}).then(r => r.json()).then(console.log)
```

**Watch the Arduino LCD** - it should display a heart ❤️

---

## Common Issues

### Issue: "Access Denied" on COM8
**Cause:** Another program is using the port  
**Fix:** Close Arduino IDE, stop all Python processes, restart backend

### Issue: "Hardware not connected"
**Cause:** Backend failed to connect during startup  
**Fix:** Restart the backend with Arduino plugged in

### Issue: Arduino LCD is Blank (but backlight works)
**Cause:** 
1. **Defective Pixels:** Some Grove LCD modules have defective pixels or contrast issues at 3.3V.
2. **Contrast Issue:** The Grove shield voltage switch might be set to 3.3V instead of 5V.

**Fix/Workaround:**
1. **Hardware Fix:** Check if your Grove Base Shield has a 3.3V/5V switch and set it to **5V**.
2. **Hardware Fix:** Replace the Grove LCD RGB Backlight module.
3. **Software Fallback:** The current `OpenHeartLCD.ino` sketch includes a **Fallback Mode** where the backlight turns **Solid Pink** (Like) or **Solid Blue** (Skip) for 3 seconds. Even if pixels are invisible, the color change confirms the system is working!

---

## Quick Reset Procedure

1. Stop backend (Ctrl+C)
2. Unplug Arduino USB
3. Wait 3 seconds
4. Plug Arduino USB back in
5. Start backend (`python app.py`)
6. Test swipe in web app
