import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { getUVIndex } from '@/services/OpenWeatherService'
import UVHome from '@/components/UVHome'

type Props = {}

const Page = (props: Props) => {
  const {top: safeTop}= useSafeAreaInsets();
  const [uvIndex, setUvIndex] = useState<number | null>(null); //state to hold uv

useEffect(()=>{
  //mock location for Ireland (Dublin)
  const mockLocation={
    latitude: 53.3498,
    longitude: -6.2603,
  };

  //fetch Uv index from service
  const fetchUvIndex = async ()=> {
    const uvData=await getUVIndex(mockLocation.latitude, mockLocation.longitude);
      setUvIndex(uvData); 
  };
  fetchUvIndex();
}, []);

  return (
    <View style={[styles.container, {paddingTop:safeTop}]}>
      <Header/>
      <View style={styles.content}>
          <UVHome uvIndex={uvIndex} />
      </View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
  },
  content: {
    padding: 16,
  },
})