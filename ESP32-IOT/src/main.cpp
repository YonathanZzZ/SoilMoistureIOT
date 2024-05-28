#include <Arduino.h>
#include "WiFi.h"
#include <SPIFFS.h>
#include <LittleFS.h>

struct Config{
    String wifi_name;
    String wifi_pass;
    String email;
    String flower_id;
};

//when using NVS, the max length for a key is 15 chars. values can be:
//integer types: uint8_t, int8_t, uint16_t, int16_t, uint32_t, int32_t, uint64_t, int64_t
//zero-terminated string
//variable length binary data (blob)

#define WIFI_NETWORK "My Network"
#define WIFI_PASSWORD "somePassword"
#define WIFI_TIMEOUT_MS 20000
#define CONFIG_FILE_PATH "../data/config.txt"
#define SENSOR_ANALOG_PIN 36 //assuming the AOUT pin of the sensor is connected to pin 36
#define NUM_OF_SAMPLES 5
#define MEASUREMENT_DELAY_MS 100
#define MAX_VAL 4095 //max value when reading analog pin (12 bit ADC)

TaskHandle_t task1_handle = NULL;
int dryValue = 4000; //these are generic values to be used before implementing a calibration feature
int wetValue = 1000;

bool connectToWiFi() {
    Serial.print("Connecting to WiFi");
    WiFi.mode(WIFI_MODE_STA); //set mode for connecting to an existing network
    WiFi.begin(WIFI_NETWORK, WIFI_PASSWORD);

    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < WIFI_TIMEOUT_MS) {
        Serial.print(".");
        delay(100);
    }

    if (WiFi.status() != WL_CONNECTED) {
        Serial.print("WiFi connection failed");
        return false;
    }

    Serial.print("WiFi connected. Device IP:");
    Serial.print(WiFi.localIP().toString());

    return true;
}

bool extractCredentialsFromConfigFile() {
    //TODO read about SmartConfig for a possible alternative

    // Mount SPIFFS filesystem
    if(!LittleFS.begin()){
        Serial.println("LittleFS mount failed");
        return false;
    }

    // Open config file
    File configFile = LittleFS.open(CONFIG_FILE_PATH, "r");
    if(!configFile){
        Serial.print("Failed to open config file");
        return false;
    }

    String line;
    while (configFile.available()){
        line = configFile.readStringUntil('\n');
        int separatorPos = line.indexOf('=');
        if(separatorPos > 0){
            String key = line.substring(0, separatorPos).c_str();
            String value = line.substring(separatorPos + 1).c_str();

            //TODO add logic to check if key is of the three expected (WIFI_NAME, WIFI_PASS, FLOWER_ID) and then save each in the correct global var.
            //
        }
    }

    configFile.close();

    //TODO check that all 3 required fields were extracted and saved in global vars (check that they're not null or empty strings)

    return true;
}

void takeMeasurements(int measurements[]){
    for(int i = 0; i < NUM_OF_SAMPLES; ++i){
        measurements[i] = analogRead(SENSOR_ANALOG_PIN);
        delay(MEASUREMENT_DELAY_MS);
    }
}

int getMedianMoisture(int measurements[]){
    // this function assumes the sensor is connected to the pin. if it isn't, values would fluctuate between two extremes.
    // to get a stable (identifiable) value when no sensor is connected (floating pin), use a pull-down or pull-up resistor

    takeMeasurements(measurements);
    std::sort(measurements, measurements + NUM_OF_SAMPLES);

    return measurements[NUM_OF_SAMPLES / 2]; // assuming odd number of samples
}

int getMoisturePercentage(int measuredValue){
    //convert the range between wetValue and dryValue to 0 - 100 (percentage)
    return map(measuredValue, dryValue, wetValue, 0, 100);
}

void task1(void *params) {
    for (;;) {
        Serial.print("Task executing");

        int measurements[NUM_OF_SAMPLES];
        takeMeasurements(measurements);
        int med = getMedianMoisture(measurements);
        int percentMoisture = getMoisturePercentage(med);

        //TODO call function to send http request. the function should receive the percentMoisture
        
        vTaskDelay(1000 / portTICK_PERIOD_MS);// suspend for 1 sec
    }
}

void setup() {
// write your initialization code here
    Serial.begin(9600); // start serial communication //TODO find correct baud rate for esp32

    bool credentialsRes = extractCredentialsFromConfigFile();
    if(!credentialsRes){
        return;
        //Note: the loop() function will still run!
    }

    bool wifiRes = connectToWiFi();
    if(!wifiRes){
        return;
    }

    xTaskCreate(
            task1, //function to run
            "Task 1", // task name
            1000, //stack size
            NULL, //task params
            1, // task priority
            &task1_handle
    );
}

void loop() {
// write your code here

}