import { icons } from '@/constants';
import React from 'react';
import { Image, Text, View } from 'react-native';
import CustomButton from './CustomButton';

const OAuth = () => {
    const handleGoogleSign = async () => { };

    return (
        <View>
            <View className="flex flex-row justify-center items-center mt-1 gap-x-3">
                <View className="flex-1 h-[1px] bg-general-100" />
                <Text className="text-lg">or</Text>
                <View className="flex-1 h-[1px] bg-general-100" />
            </View>
            <CustomButton
                title="LogIn with Google"
                className="mt-2 w-full shadow-none"
                bgVariant="outline"
                textVariant="primary"
                IconLeft={() => (
                    <Image
                        source={icons.google}
                        resizeMode="contain"
                        className="w-5 h-5  mx-2"
                    />
                )}
                onPress={handleGoogleSign}
            />
        </View>
    );
};

export default OAuth;
