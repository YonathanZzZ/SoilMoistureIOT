#include "SensorManager.hpp"
#include <Arduino.h>

SensorManager::SensorManager(int sensorPin) : sensorPin(sensorPin){
}

void SensorManager::measure(long measurements[], size_t times, size_t interval){
  size_t i = 0;
  for(i = 0; i < times; ++i){
    measurements[i] = measure();
    delay(interval);
  }
}

long SensorManager::measure()
{
  return analogRead(sensorPin);
}