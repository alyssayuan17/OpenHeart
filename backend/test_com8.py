import serial
import time

print("Attempting to connect to COM8...")
try:
    ser = serial.Serial('COM8', 9600, timeout=1)
    print("SUCCESS! Connected to COM8")
    time.sleep(2)
    ser.close()
    print("Connection closed successfully")
except serial.SerialException as e:
    print(f"FAILED: {e}")
    print("\nPossible solutions:")
    print("1. Unplug and replug the Arduino USB cable")
    print("2. Close any programs that might be using COM8")
    print("3. Restart your computer")
    print("4. Check Device Manager for driver issues")
