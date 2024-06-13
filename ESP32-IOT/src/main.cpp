#include <Arduino.h>
#include "WiFi.h"
#include <LittleFS.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

struct Config
{
    String wifi_name;
    String wifi_pass;
    String device_id;
    String device_secret_key;
} config;

#define WIFI_TIMEOUT_MS 20000
#define CONFIG_FILE_PATH "/config.txt"
#define SENSOR_PIN 2 // assuming the AOUT pin of the sensor is connected to pin 2
#define NUM_OF_SAMPLES 5
#define MEASUREMENT_DELAY_MS 100
#define MAX_VAL 4095 // max value when reading analog pin (12 bit ADC)
#define BAUD_RATE 115200
#define MAX_HTTP_ATTEMPTS 3

TaskHandle_t task1_handle = NULL;
int dryValue = 4000; // these are generic values to be used before implementing a calibration feature
int wetValue = 1000;

bool connectToWiFi()
{
    WiFi.mode(WIFI_MODE_STA); // set mode for connecting to an existing network
    WiFi.begin(config.wifi_name, config.wifi_pass);

    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < WIFI_TIMEOUT_MS)
    {
        Serial.println(".");
        delay(1000);
    }

    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("WiFi connection failed");
        return false;
    }

    Serial.println("WiFi connected. Device IP:");
    Serial.println(WiFi.localIP().toString());

    return true;
}

bool extractCredentialsFromConfigFile()
{
    // Mount LittleFS filesystem
    if (!LittleFS.begin(true)) //format littleFS if failed
    {
        Serial.println("LittleFS mount failed");
        return false;
    }

    File configFile = LittleFS.open(CONFIG_FILE_PATH, "r");
    if (!configFile)
    {
        Serial.println("Failed to open config file");
        return false;
    }

    String line;
    while (configFile.available())
    {
        line = configFile.readStringUntil('\n');
        int separatorPos = line.indexOf('=');
        if (separatorPos > 0)
        {
            String key = line.substring(0, separatorPos).c_str();
            String value = line.substring(separatorPos + 1).c_str();

            if (key == "WIFI_NAME")
            {
                config.wifi_name = value;
            }

            else if (key == "WIFI_PASS")
            {
                config.wifi_pass = value;
            }

            else if (key == "DEVICE_SECRET_KEY")
            {
                config.device_secret_key = value;
            }

            else if (key == "DEVICE_ID")
            {
                config.device_id = value;
            }
        }
    }

    configFile.close();
    
    bool configCheckRes = true;
    if(config.device_id.isEmpty() || config.device_secret_key.isEmpty() || config.wifi_name.isEmpty() || config.wifi_pass.isEmpty()){
        Serial.println("One or more config fields is empty");
        configCheckRes = false;
    }

    return configCheckRes;
}

void takeMeasurements(int measurements[], int num_of_measurements)
{
    for (int i = 0; i < num_of_measurements; ++i)
    {
        measurements[i] = analogRead(SENSOR_PIN);
        Serial.println("Measurement: ");
        Serial.println(measurements[i]);
        delay(MEASUREMENT_DELAY_MS);
    }
}

int getMedianMoisture(int measurements[])
{
    // this function assumes the sensor is connected to the pin. if it isn't, values would fluctuate between two extremes.
    // to get a stable (identifiable) value when no sensor is connected (floating pin), use a pull-down or pull-up resistor
    std::sort(measurements, measurements + NUM_OF_SAMPLES);

    return measurements[NUM_OF_SAMPLES / 2]; // assuming odd number of samples
}

long getMoisturePercentage(int measuredValue)
{
    // convert the range between wetValue and dryValue to 0 - 100 (percentage)
    long value = map(measuredValue, dryValue, wetValue, 0, 100);
    if(value > 100){
        value = 100;
    }else if(value < 0){
        value = 0;
    }

    return value;
}

// ---------- HTTP REQUEST -------------

bool sendMeasurement(int measurement)
{
    Serial.println("in sendMeasurement");

    String url = "http://192.168.1.217:8080/measurements"; 

    WiFiClient client;
    HTTPClient http;

    http.begin(client, url);

    http.addHeader("Content-Type", "application/json");
    http.addHeader("Device-Identifier", config.device_id);
    http.addHeader("Device-Secret", config.device_secret_key);

    JsonDocument jsonDoc;
    jsonDoc["measuredValue"] = measurement;
    jsonDoc["Hello"] = "Nice";

    String jsonString;
    serializeJson(jsonDoc, jsonString);

    int responseCode = http.POST(jsonString);

    http.end();

    Serial.println("sent measurement via HTTP");

    bool res = true;
    if (responseCode != 200)
    {
        res = false;
        Serial.println("HTTP request failed");
    }
    
    Serial.println("HTTP response code: ");
    Serial.println(responseCode);

    return res;
}

// ---------- END OF HTTP REQUEST -------------

void task1(void *params)
{
    UBaseType_t uxHighWaterMark;

    for (;;)
    {
        Serial.println("Task executing");

        int measurements[NUM_OF_SAMPLES];
        takeMeasurements(measurements, NUM_OF_SAMPLES);
        int med = getMedianMoisture(measurements);
        long percentMoisture = getMoisturePercentage(med);

        Serial.println("Moisture percentage: ");
        Serial.println(percentMoisture);

        Serial.println("Connecting to WiFi");
        bool wifiRes = connectToWiFi();
        if (!wifiRes)
        {
            Serial.print("Failed to connect to WiFi");
            return;
        }

        Serial.println("Connected to WiFi");

        Serial.println("Sending measurement to server");

        int attempts = 1;

        bool measurementRes = sendMeasurement(percentMoisture);
        while (!measurementRes && attempts < MAX_HTTP_ATTEMPTS)
        {
            Serial.println("Retrying to send measurement");

            measurementRes = sendMeasurement(percentMoisture);

            ++attempts;
            delay(5000);
        }

        Serial.println("measurement res:");
        Serial.println(measurementRes);

        Serial.println("Disconnecting WiFi");

        WiFi.disconnect(true);

        vTaskDelay(1000 * 5 / portTICK_PERIOD_MS); // suspend for 5 seconds

        uxHighWaterMark = uxTaskGetStackHighWaterMark(NULL); //check stack size
        Serial.println("stack size:");
        Serial.println(uxHighWaterMark);
    }
}

void setup()
{
    // initialization
    Serial.begin(BAUD_RATE); // start serial communication

    bool credentialsRes = extractCredentialsFromConfigFile();
    if (!credentialsRes)
    {
        return;
    }

    xTaskCreate(
        task1,    // function to run
        "Task 1", // task name
        50000,     // stack size
        NULL,     // task params
        1,        // task priority
        &task1_handle);
}

void loop()
{
}

