#include <Wire.h>
#include "rgb_lcd.h"

rgb_lcd lcd;

// --- Pin Definitions ---
const int BUZZER_PIN = 5;  // Grove buzzer on D5

// --- Color Definitions (R, G, B) ---
const int colorLike[3] = {255, 0, 100};   // Bright Pink
const int colorSkip[3] = {0, 0, 255};     // Bright Blue
const int colorIdle[3] = {50, 50, 50};    // Dim White (save power)

// --- Custom Character Bitmaps (5x8 pixels) ---
// Heart icon (Character 0)
byte heart[8] = {
    0b00000,
    0b01010,
    0b11111,
    0b11111,
    0b11111,
    0b01110,
    0b00100,
    0b00000
};

// X icon (Character 1)
byte xIcon[8] = {
    0b00000,
    0b10001,
    0b01010,
    0b00100,
    0b01010,
    0b10001,
    0b00000,
    0b00000
};

void setup() {
    Wire.begin();
    Serial.begin(9600);

    // Initialize buzzer pin
    pinMode(BUZZER_PIN, OUTPUT);
    digitalWrite(BUZZER_PIN, LOW);

    lcd.begin(16, 2);
    
    // Create custom characters
    lcd.createChar(0, heart);  // Register heart icon as character 0
    lcd.createChar(1, xIcon);  // Register X icon as character 1
    
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
    
    // 4. Play Match Sound - Happy celebration buzz!
    for (int i = 0; i < 3; i++) {
        tone(BUZZER_PIN, 500);  // Play 1000 Hz tone
        delay(500);
        noTone(BUZZER_PIN);
        delay(100);
    }
    
    // Hold for remaining time
    delay(2250);
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