"""
Arduino LCD Test Script

Quick script to test your Arduino connection and display.
Run this to verify everything works before starting the full backend.
"""

import sys
import time
from arduino_service import ArduinoLCDService


def main():
    print("=" * 60)
    print("OpenHeart Arduino LCD Test Script")
    print("=" * 60)
    print()
    
    # Create Arduino service
    print("🔌 Attempting to connect to Arduino...")
    arduino = ArduinoLCDService()
    
    if not arduino.is_connected:
        print("\n❌ ERROR: Could not connect to Arduino!")
        print("\nTroubleshooting:")
        print("1. Make sure Arduino is plugged in via USB")
        print("2. Check Device Manager for the COM port")
        print("3. Close Arduino IDE Serial Monitor if open")
        print("4. Try specifying port manually:")
        print("   python test_arduino.py COM3")
        return 1
    
    status = arduino.get_status()
    print(f"✅ Connected successfully!")
    print(f"   Port: {status['port']}")
    print(f"   Baud Rate: {status['baud_rate']}")
    print()
    
    # Interactive test menu
    while True:
        print("\n" + "=" * 60)
        print("Test Menu:")
        print("=" * 60)
        print("1. Send LIKE signal (Heart ❤️)")
        print("2. Send SKIP signal (X ❌)")
        print("3. Test sequence (alternate Like/Skip 5 times)")
        print("4. Check connection status")
        print("5. Exit")
        print()
        
        choice = input("Enter your choice (1-5): ").strip()
        
        if choice == '1':
            print("\n📤 Sending LIKE signal to Arduino...")
            success = arduino.send_like()
            if success:
                print("✅ LIKE signal sent! Check your LCD for a heart ❤️")
            else:
                print("❌ Failed to send signal. Check connection.")
        
        elif choice == '2':
            print("\n📤 Sending SKIP signal to Arduino...")
            success = arduino.send_skip()
            if success:
                print("✅ SKIP signal sent! Check your LCD for an X ❌")
            else:
                print("❌ Failed to send signal. Check connection.")
        
        elif choice == '3':
            print("\n🔄 Running test sequence...")
            for i in range(5):
                print(f"\n  Round {i+1}/5:")
                
                print("    Sending LIKE... ❤️")
                arduino.send_like()
                time.sleep(3.5)  # Wait for display to reset (3s delay + 0.5s buffer)
                
                print("    Sending SKIP... ❌")
                arduino.send_skip()
                time.sleep(3.5)  # Wait for display to reset (3s delay + 0.5s buffer)
            
            print("\n✅ Test sequence complete!")
        
        elif choice == '4':
            status = arduino.get_status()
            print("\n📊 Arduino Status:")
            print(f"   Connected: {status['connected']}")
            print(f"   Port: {status['port']}")
            print(f"   Baud Rate: {status['baud_rate']}")
        
        elif choice == '5':
            print("\n👋 Disconnecting and exiting...")
            arduino.disconnect()
            print("✅ Disconnected. Goodbye!")
            return 0
        
        else:
            print("\n❌ Invalid choice. Please enter 1-5.")


if __name__ == "__main__":
    try:
        # Check if port was provided as command line argument
        if len(sys.argv) > 1:
            port = sys.argv[1]
            print(f"Using specified port: {port}")
            from arduino_service import ArduinoLCDService
            arduino = ArduinoLCDService(port=port)
        
        exit_code = main()
        sys.exit(exit_code)
    
    except KeyboardInterrupt:
        print("\n\n👋 Interrupted by user. Exiting...")
        sys.exit(0)
    
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
