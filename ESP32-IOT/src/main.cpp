#include <Arduino.h>
#include <LittleFS.h>
#include "SoilMoistureMonitor.hpp"

struct Config
{
    String wifi_name;
    String wifi_pass;
    String device_id;
    String device_secret_key;
} config;

#define WIFI_TIMEOUT_MS 20000 //20 seconds
#define CONFIG_FILE_PATH "/config.txt"
#define SENSOR_PIN 2
#define NUM_OF_SAMPLES 5
#define MEASUREMENT_INTERVAL_MS 500 //half a second
#define BAUD_RATE 115200

TaskHandle_t task1_handle = nullptr;

bool extractCredentialsFromConfigFile()
{
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
            String key = line.substring(0, separatorPos);
            String value = line.substring(separatorPos + 1);

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

void task1(void *params){
    auto *monitor = static_cast<SoilMoistureMonitor*>(params);
    unsigned char percentMoisture;
    bool wifiRes;
    bool sendRes;

    for(;;){
        percentMoisture = monitor->measureMoisturePercentage(NUM_OF_SAMPLES, MEASUREMENT_INTERVAL_MS);
        wifiRes = monitor->connectToWiFi(WIFI_TIMEOUT_MS);
        if(!wifiRes){
            Serial.println("Failed to connect to WiFi");
            continue;
        }else{
            Serial.println("Successfully connected to WiFi");
        }

        sendRes = monitor->sendMeasurementToServer(percentMoisture); //crashes here
        if(!sendRes){
            Serial.println("Failed to send measurement to server");
        }else{
            Serial.println("Successfully sent measurement to server!");
        }

        monitor->disconnectWiFi();

        vTaskDelay(1000 * 10 / portTICK_PERIOD_MS); // suspend for 5 seconds
    }
}

void setup()
{
    // initialization
    Serial.begin(BAUD_RATE); 

    bool credentialsRes = extractCredentialsFromConfigFile();
    if (!credentialsRes)
    {
        return;
    }

    const char *serverURL = "http://10.10.1.57:8080/measurements"; //local network address, for testing
    int dryValue = 4000; //adjust by calibrating
    int wetValue = 1000;

    //create class instance
    SoilMoistureMonitor *monitor = new SoilMoistureMonitor(serverURL, config.wifi_name, config.wifi_pass, SENSOR_PIN, config.device_id, config.device_secret_key, dryValue, wetValue);

    xTaskCreate(
        task1,    // function to run
        "SoilMonitorTask", // task name
        50000,     // stack size
        monitor,     // task params
        1,        // task priority
        &task1_handle);
}

void loop()
{
}

