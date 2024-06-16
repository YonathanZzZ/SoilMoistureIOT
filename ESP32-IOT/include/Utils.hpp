#ifndef UTILS_HPP
#define UTILS_HPP

#include <cstddef>

class Utils {
  public:
  static long getMedian(long values[], size_t size);
  static unsigned char voltageToPercent(long measuredValue, int minValue, int maxValue);
};

#endif //UTILS_HPP