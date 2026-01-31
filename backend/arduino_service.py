"""
Arduino LCD Service for OpenHeart

Handles serial communication with Arduino R4 + Grove LCD RGB Backlight.
Sends 'L' for Like/Match and 'D' for Dislike/Skip.
"""

import serial
import serial.tools.list_ports
import threading
import time
from typing import Optional


class ArduinoLCDService:
    """Service to manage Arduino LCD display communication."""
    
    def __init__(self, port: Optional[str] = None, baud_rate: int = 9600, timeout: int = 1):
        """
        Initialize the Arduino LCD Service.
        
        Args:
            port: COM port for Arduino (e.g., 'COM3', 'COM4'). If None, auto-detect.
            baud_rate: Serial baud rate (default: 9600, must match Arduino code)
            timeout: Serial timeout in seconds
        """
        self.baud_rate = baud_rate
        self.timeout = timeout
        self.serial_port: Optional[serial.Serial] = None
        self.port = port
        self.is_connected = False
        self.lock = threading.Lock()
        
        # Try to connect on initialization
        if self.port is None:
            self.port = self._auto_detect_arduino()
        
        if self.port:
            self.connect()
    
    def _auto_detect_arduino(self) -> Optional[str]:
        """
        Auto-detect Arduino port by searching for Arduino devices.
        
        Returns:
            Port name if found, None otherwise
        """
        ports = serial.tools.list_ports.comports()
        
        # Common Arduino identifiers
        arduino_identifiers = [
            'Arduino',
            'CH340',  # Common USB-to-serial chip
            'CP210',  # Another common chip
            'USB Serial',
            'COM'      # Windows COM ports
        ]
        
        for port in ports:
            port_info = f"{port.description} {port.manufacturer} {port.hwid}".lower()
            for identifier in arduino_identifiers:
                if identifier.lower() in port_info:
                    print(f"[Arduino] Auto-detected on port: {port.device}")
                    return port.device
        
        # If no Arduino detected, list all available ports
        if ports:
            print("[Arduino] Available ports:")
            for port in ports:
                print(f"  - {port.device}: {port.description}")
            # Return the first available port as a fallback
            return ports[0].device
        
        return None
    
    def log(self, message):
        """Log to file and console to avoid buffering issues."""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        msg = f"[{timestamp}] {message}"
        print(msg)
        try:
            with open("arduino_debug.txt", "a") as f:
                f.write(msg + "\n")
        except Exception:
            # Intentionally ignore logging errors to avoid impacting main application flow
            pass

    def connect(self) -> bool:
        """
        Establish persistent connection to Arduino.
        """
        if not self.port:
            self.log("[Arduino] No port specified. Cannot connect.")
            return False
        
        try:
            with self.lock:
                if self.serial_port and self.serial_port.is_open:
                    return True # Already connected

                self.log(f"[Arduino] Connecting to {self.port}...")
                self.serial_port = serial.Serial(
                    port=self.port,
                    baudrate=self.baud_rate,
                    timeout=self.timeout
                )
                # Wait for Arduino to reset (essential for Uno R4/R3)
                time.sleep(3.0)
                self.is_connected = True
                self.log(f"[Arduino] SUCCESSFULLY CONNECTED to {self.port}")
                return True
        except serial.SerialException as e:
            self.log(f"[Arduino] Connection failed: {e}")
            self.is_connected = False
            return False

    def send_command(self, command: str) -> bool:
        """
        Send a single character command to Arduino using persistent connection.
        """
        self.log(f"[Arduino DEBUG] Sending command: {command}")
        
        if not self.is_connected or not self.serial_port or not self.serial_port.is_open:
            self.log("[Arduino] Connection lost. Reconnecting...")
            if not self.connect():
                return False
        
        try:
            with self.lock:
                self.serial_port.write(command.encode())
                self.serial_port.flush()
                self.log(f"[Arduino] Sent: {command}")
                return True
        except Exception as e:
            self.log(f"[Arduino] Error sending: {e}")
            self.is_connected = False
            try:
                self.serial_port.close()
            except:
                pass
            return False
    
    def send_like(self) -> bool:
        """
        Send 'Like' signal to Arduino (displays heart).
        
        Returns:
            True if sent successfully, False otherwise
        """
        return self.send_command('L')
    
    def send_skip(self) -> bool:
        """
        Send 'Skip/Dislike' signal to Arduino (displays X).
        
        Returns:
            True if sent successfully, False otherwise
        """
        return self.send_command('D')
    
    def get_status(self) -> dict:
        """
        Get the current connection status.
        
        Returns:
            Dictionary with connection info
        """
        return {
            'connected': self.is_connected,
            'port': self.port,
            'baud_rate': self.baud_rate
        }


# Global singleton instance
_arduino_service: Optional[ArduinoLCDService] = None


def get_arduino_service() -> ArduinoLCDService:
    """
    Get or create the global Arduino service instance.
    Reads ARDUINO_PORT from environment variable if set.
    
    Returns:
        ArduinoLCDService instance
    """
    global _arduino_service
    if _arduino_service is None:
        import os
        # Check if port is specified in environment
        port = os.getenv('ARDUINO_PORT')
        if port:
            print(f"[Arduino] Using port from ARDUINO_PORT env var: {port}")
            _arduino_service = ArduinoLCDService(port=port)
        else:
            _arduino_service = ArduinoLCDService()
    return _arduino_service


def cleanup_arduino_service():
    """Clean up and disconnect the Arduino service."""
    global _arduino_service
    if _arduino_service:
        _arduino_service.disconnect()
        _arduino_service = None
