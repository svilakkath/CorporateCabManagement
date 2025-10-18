import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import 'react-native-get-random-values';



import React from 'react';

const Home = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }
  return <Redirect href="/welcome" />;
};
export default Home;
