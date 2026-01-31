#include <Wire.h>
#include "rgb_lcd.h"

rgb_lcd lcd;

// --- Color Definitions (R, G, B) ---
const int colorLike[3] = {255, 0, 100};   // Bright Pink
const int colorSkip[3] = {0, 0, 255};     // Bright Blue
const int colorIdle[3] = {50, 50, 50};    // Dim White (save power)

void setup() {
    Wire.begin();
    Serial.begin(9600);

    lcd.begin(16, 2);
    
    // STARTUP SEQUENCE
    // Flash colors to show it's alive
    lcd.setRGB(255, 0, 0); delay(200);
    lcd.setRGB(0, 255, 0); delay(200);
    lcd.setRGB(0, 0, 255); delay(200);
    
    // Set to Idle
    resetScreen();
}

void loop() {
    if (Serial.available() > 0) {
        char incomingByte = Serial.read();

        if (incomingByte == 'L' || incomingByte == 'l') {
            displayLike();
        }
        else if (incomingByte == 'D' || incomingByte == 'd') {
            displaySkip();
        }
    }
}

void displayLike() {
    // 1. Set Color
    lcd.setRGB(colorLike[0], colorLike[1], colorLike[2]);
    
    // 2. Clear & Print Text
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("It's a Match!");
    
    // 3. Draw Hearts (Custom Character 0)
    lcd.setCursor(6, 1); // Center bottom
    lcd.write((unsigned char)0);
    lcd.write((unsigned char)0);
    lcd.write((unsigned char)0);
    
    // Hold for 3 seconds
    delay(3000);
    resetScreen();
}

void displaySkip() {
    // 1. Set Color
    lcd.setRGB(colorSkip[0], colorSkip[1], colorSkip[2]);
    
    // 2. Clear & Print Text
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("      SKIP      ");
    
    // 3. Draw Xs (Custom Character 1)
    lcd.setCursor(7, 1);
    lcd.write((unsigned char)1);
    lcd.write((unsigned char)1);
    
    // Hold for 3 seconds
    delay(3000);
    resetScreen();
}

void resetScreen() {
    lcd.setRGB(colorIdle[0], colorIdle[1], colorIdle[2]);
}