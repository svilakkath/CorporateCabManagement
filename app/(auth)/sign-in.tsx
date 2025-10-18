import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import OAuth from '@/components/OAuth';
import { icons, images } from '@/constants';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';

const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const onSignInPress = useCallback(async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.push('/(root)/(tabs)/home');
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err: any) {
            const errorMessage =
                err.errors?.[0]?.message || err.message || 'An unknown error occurred';
            Alert.alert('Error', errorMessage);
        }
    }, [isLoaded, form.email, form.password]);

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-8 left-5">
                        Welcome ,
                    </Text>
                </View>
                <View className="p-6 mt-[-30px]">
                    <InputField
                        label="Email"
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value) =>
                            setForm({
                                ...form,
                                email: value,
                            })
                        }
                        placeHolder="Enter your email"
                    />
                    <InputField
                        label="Password"
                        icon={icons.lock}
                        value={form.password}
                        onChangeText={(value) =>
                            setForm({
                                ...form,
                                password: value,
                            })
                        }
                        placeHolder="Enter your password"
                        secureTextEntry={true}
                    />
                    <CustomButton
                        title="Sign in"
                        onPress={onSignInPress}
                        className="mt-1"
                    />
                    <OAuth />
                    <Link
                        href="/sign-up"
                        className="text-lg text-center text-general-200 mt-2"
                    >
                        <Text>Dont't have an account? </Text>
                        <Text className="text-primary-500">Sign up</Text>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
};

export default SignIn;
