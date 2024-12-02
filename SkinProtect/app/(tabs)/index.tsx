import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/Header'

type Props = {}

const Page = (props: Props) => {
  const {top: safeTop}= useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop:safeTop}]}>
      <Header/>
      <Text>Home Screen</Text>
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
})