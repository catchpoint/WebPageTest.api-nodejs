#include <stdio.h>
#include <expat.h>

int main () {
  XML_Expat_Version v;
  v = XML_ExpatVersionInfo();
  printf("Using libexpat v%d.%d.%d\n", v.major, v.minor, v.micro);
  return 0;
}
