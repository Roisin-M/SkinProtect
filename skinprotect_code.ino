/*
  Conditionals - If statement

  This example demonstrates the use of if() statements.
  It reads the state of a potentiometer (an analog input) and turns on an LED
  only if the potentiometer goes above a certain threshold level. It prints the
  analog value regardless of the level.

  The circuit:
  - potentiometer
    Center pin of the potentiometer goes to analog pin 0.
    Side pins of the potentiometer go to +5V and ground.
  - LED connected from digital pin 13 to ground

  - Note: On most Arduino boards, there is already an LED on the board connected
    to pin 13, so you don't need any extra components for this example.

  created 17 Jan 2009
  modified 9 Apr 2012
  by Tom Igoe

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/IfStatement
*/
#include <Wire.h>
#include "rgb_lcd.h"

rgb_lcd lcd;

// These constants won't change:
const int analogPin = A0;    // pin that the sensor is attached to
const int analogPin2=A1; //2nd potentionmeter

/*skin type variables*/
const double type1 = 170.5;
const double type2 = 341;
const double type3 = 511.5;
const double type4 = 682;
const double type5 = 852.5;
const double type6 = 1023;
int userSkinType = 0;

const int colorR = 255;
const int colorG = 0;
const int colorB = 0;

/*uv level varaibles*/
const double low = 255.75;
const double moderate = 511.5;
const double high = 767.25;
const double extreme = 1023;
String userUVIndex = "";


/*we need two potentiometers, 1 for the skin type and one for the uv level.*/
void setup()
{
    // initialize serial communications:
  Serial.begin(9600);
  // set up the LCD's number of columns and rows:
  lcd.begin(25, 3);
}
//loop for reading in values from the skin type potentionmeter
void loop() {
  // read the value of the potentiometer:
  int analogValue = analogRead(analogPin);
  

  if (analogValue <= type1)
  {
    userSkinType = 1;
  }
  else if (analogValue > type1 && analogValue <= type2)
  {
    userSkinType = 2;
  }
  else if (analogValue > type2 && analogValue <= type3)
  {
    userSkinType = 3;
  }
  else if (analogValue > type3 && analogValue <= type4)
  {
    userSkinType = 4;
  }
  else if (analogValue > type4 && analogValue <= type5)
  {
    userSkinType = 5;
  }
  else if (analogValue > type5 && analogValue <= type6)
  {
    userSkinType = 6;
  }

      // read the value of the potentiometer:
    int analogValue2 = analogRead(analogPin2);

    if (analogValue2 <= low)
    {
      userUVIndex = "low";
    }
    else if (analogValue2 > low && analogValue2 <= moderate)
    {
      userUVIndex = "moderate";
    }
    else if (analogValue2 > moderate && analogValue2 <= high)
    {
      userUVIndex = "high";
    }
    else if (analogValue2 > high && analogValue2 <= extreme)
    {
      userUVIndex = "extreme";
    }
          if(userUVIndex=="low")
      {
        
    // do something different depending on the range value:
  switch (userSkinType) {
    case 1:   
      lcd.print("spf 10");
      delay(10000);
      break;
    case 2:   
      lcd.print("spf 10");
      delay(10000);
      break;
    case 3:    
      lcd.print("spf 10");
      delay(10000);
      break;
    case 4:    
      lcd.print("spf 6");
      delay(10000);
      break;
          case 5:  
      lcd.print("spf 6");
      delay(10000);
      break;
    case 6:    
      lcd.print("spf 6");
      delay(10000);
      break;
  } 
      }
        else if(userUVIndex=="moderate")
      {
        
    // do something different depending on the range value:
  switch (userSkinType) {
    case 1:   
      lcd.print("spf 25");
      delay(10000);
      break;
    case 2:   
      lcd.print("spf 25");
      delay(10000);
      break;
    case 3:    
      lcd.print("spf 20");
      delay(10000);
      break;
    case 4:    
      lcd.print("spf 20");
      delay(10000);
      break;
          case 5:  
      lcd.print("spf 15");
      delay(10000);
      break;
    case 6:    
      lcd.print("spf 15");
      delay(10000);
      break;
  } 
      }
              else if(userUVIndex=="high")
      {
        
    // do something different depending on the range value:
  switch (userSkinType) {
    case 1:   
      lcd.print("spf 50");
      delay(10000);
      break;
    case 2:   
      lcd.print("spf 50");
      delay(10000);
      break;
    case 3:    
      lcd.print("spf 50");
      delay(10000);
      break;
    case 4:    
      lcd.print("spf 30");
      delay(10000);
      break;
          case 5:  
      lcd.print("spf 30");
      delay(10000);
      break;
    case 6:    
      lcd.print("spf 30");
      delay(10000);
      break;
  } 
      }
              else if(userUVIndex=="extreme")
      {
        
    // do something different depending on the range value:
  switch (userSkinType) {
    case 1:   
      lcd.print("spf 50+");
      delay(10000);
      break;
    case 2:   
      lcd.print("spf 50+");
      delay(10000);
      break;
    case 3:    
      lcd.print("spf 50+");
      delay(10000);
      break;
    case 4:    
      lcd.print("spf 50+");
      delay(10000);
      break;
          case 5:  
      lcd.print("spf 50+");
      delay(10000);
      break;
    case 6:    
      lcd.print("spf 50+");
      delay(10000);
      break;
  } 
      }


}


   



  
