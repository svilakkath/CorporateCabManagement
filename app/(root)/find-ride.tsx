// import { Text, View } from "react-native";

// import CustomButton from "@/components/CustomButton";
// import GoogleTextInput from "@/components/GoogleTextInput";
// import RideLayout from "@/components/RideLayout";
// import { icons } from "@/constants";
// import { useLocationStore } from "@/store";
// import { router } from "expo-router";

// const FindRide = () => {
//     const {
//         userAddress,
//         destinationAddress,
//         setDestinationLocation,
//         setUserLocation,
//     } = useLocationStore();

//     return (
//         <RideLayout title="Ride">
//             <View className="my-3">
//                 <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>

//                 <GoogleTextInput
//                     icon={icons.target}
//                     initialLocation={userAddress!}
//                     containerStyle="bg-neutral-100"
//                     textInputBackgroundColor="#f5f5f5"
//                     handlePress={(location) => setUserLocation(location)}
//                 />
//             </View>

//             <View className="my-3">
//                 <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>

//                 <GoogleTextInput
//                     icon={icons.map}
//                     initialLocation={destinationAddress!}
//                     containerStyle="bg-neutral-100"
//                     textInputBackgroundColor="transparent"
//                     handlePress={(location) => setDestinationLocation(location)}
//                 />
//             </View>

//             <CustomButton
//                 title="Find Now"
//                 onPress={() => router.push(`/(root)/(tabs)/rides`)}
//                 className="mt-5"
//             />
//         </RideLayout>
//     );
// };

// export default FindRide;

import CustomButton from '@/components/CustomButton';
import CustomPlacesAutoComplete, { MyLocation } from '@/components/CustomPlacesAutoComplete';
import RideLayout from '@/components/RideLayout';
import { icons } from '@/constants';
import { useLocationStore } from '@/store';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const myLocations: MyLocation[] = [
    { latitude: 40.712776, longitude: -74.005974, address: 'New York, NY, USA' },
    { latitude: 34.052235, longitude: -118.243683, address: 'Los Angeles, CA, USA' },
    { latitude: 41.878113, longitude: -87.629799, address: 'Chicago, IL, USA' },
];
const FindRide = () => {
    const {
        setUserLocation,
        destinationAddress,
        userAddress,
        setDestinationLocation,
    } = useLocationStore();

    return (
        <RideLayout title='Ride'>
            <View className='my-3'>
                <Text className='text-lg font-JakartaSemiBold mb-3'>From</Text>
                <CustomPlacesAutoComplete
                    data={myLocations}
                    icon={icons.target}
                    initialLocation={userAddress}
                    containerStyle={{ backgroundColor: '#f5f5f5' }}
                    textInputBackgroundColor="gray"
                    onPress={(location) => setUserLocation(location)}
                />
            </View>
            <View className='my-3'>
                <Text className='text-lg font-JakartaSemiBold mb-3'>To</Text>
                <CustomPlacesAutoComplete
                    data={myLocations}
                    icon={icons.map}
                    initialLocation={destinationAddress}
                    containerStyle={{ backgroundColor: '#f5f5f5' }}
                    textInputBackgroundColor="gray"
                    onPress={(location) => setDestinationLocation(location)}
                />
            </View>
            <CustomButton
                title='Find now'
                onPress={() => router.push('/(root)/confirm-ride')}
                className='mt-5'
            />
        </RideLayout>
    );
};

export default FindRide;
