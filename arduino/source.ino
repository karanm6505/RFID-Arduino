#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define SS_PIN 10
#define RST_PIN 9
#define BUZZER_PIN 3

#define TRIG_PIN 6
#define ECHO_PIN 5

MFRC522 mfrc522(SS_PIN, RST_PIN);  // RFID instance
LiquidCrystal_I2C lcd(0x27, 16, 2); // LCD at I2C address 0x27

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
  digitalWrite(BUZZER_PIN, HIGH);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("System Ready");
  delay(1500);
  lcd.clear();
}

void loop() {
  long distance = measureDistance();

  if (distance > 10) {
    lcd.setCursor(0, 0);
    lcd.print("Move Closer     ");
    lcd.setCursor(0, 1);
    lcd.print("to RFID Scanner ");
    delay(500);
    return;
  } else {
    lcd.setCursor(0, 0);
    lcd.print("Scan your card  ");
    lcd.setCursor(0, 1);
    lcd.print("                ");
  }

  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  buzz(200);

  // Read and display data
  String name = readBlock(4);
  String srn = readBlock(5);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(name);
  lcd.setCursor(0, 1);
  lcd.print("Attndnc Granted");
  
  Serial.println(name + "," + srn);  // e.g., "Adithya,01FE22A123"

  mfrc522.PICC_HaltA(); 
  mfrc522.PCD_StopCrypto1(); 
  delay(3000); // Show message before resetting LCD
  lcd.clear();
}

long measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  long distance = duration * 0.034 / 2;
  return distance;
}

void buzz(int durationMs) {
  digitalWrite(BUZZER_PIN, LOW);
  delay(durationMs);
  digitalWrite(BUZZER_PIN, HIGH);
}


String readBlock(byte blockNum) {
  byte buffer[18];
  byte size = sizeof(buffer);
  MFRC522::StatusCode status;

  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  status = mfrc522.PCD_Authenticate(
    MFRC522::PICC_CMD_MF_AUTH_KEY_A,
    blockNum, &key, &(mfrc522.uid)
  );
  if (status != MFRC522::STATUS_OK) {
    Serial.print("Auth failed for block ");
    Serial.println(blockNum);
    return "";
  }

  status = mfrc522.MIFARE_Read(blockNum, buffer, &size);
  if (status != MFRC522::STATUS_OK) {
    Serial.print("Read failed for block ");
    Serial.println(blockNum);
    return "";
  }

  String result = "";
  for (int i = 0; i < 16; i++) {
    if (buffer[i] == 0) break;
    result += (char)buffer[i];
  }

  return result;
}