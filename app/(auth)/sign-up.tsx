import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import OAuth from '@/components/OAuth';
import { icons, images } from '@/constants';
import { fetchAPI } from '@/lib/fetch';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { ReactNativeModal } from 'react-native-modal';

const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [verification, setVerification] = useState({
        state: 'default',
        error: '',
        code: '',
    });

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                emailAddress: form.email,
                password: form.password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            setVerification({
                ...verification,
                state: 'pending',
            });
        } catch (err: any) {
            const errorMessage =
                err.errors?.[0]?.message || err.message || 'An unknown error occurred';
            Alert.alert('Error', errorMessage);
        }
    };

    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            });
            if (completeSignUp.status === 'complete') {
                // TODO database user
                await fetchAPI('/(api)/user', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        clerkId: completeSignUp.createdUserId,
                    })
                })

                await setActive({ session: completeSignUp.createdSessionId });
                setVerification({ ...verification, state: 'success' });
            } else {
                console.log('not completed');

                setVerification({
                    ...verification,
                    error: 'verification failed',
                    state: 'failed',
                });
            }
        } catch (err: any) {
            setVerification({
                ...verification,
                error: err.errors?.[0]?.message || err.message,
                state: 'failed',
            });
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-8 left-5">
                        Create your account
                    </Text>
                </View>
                <View className="p-6 mt-[-30px]">
                    <InputField
                        label="Name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) =>
                            setForm({
                                ...form,
                                name: value,
                            })
                        }
                        placeHolder="Enter your name"
                    />
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
                        title="Sign up"
                        onPress={onSignUpPress}
                        className="mt-1"
                    />
                    <OAuth />
                    <Link
                        href="/sign-in"
                        className="text-lg text-center text-general-200 mt-2"
                    >
                        <Text>Already have an account? </Text>
                        <Text className="text-primary-500">Log in</Text>
                    </Link>
                </View>
                <ReactNativeModal
                    isVisible={verification.state === 'pending'}
                    onModalHide={() => {
                        if (verification.state === 'success') {
                            setShowSuccessModal(true);
                        }
                    }}
                >
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] ">
                        <Text className="text-2xl font-JakartaExtraBold mb-2"></Text>
                        <Text className="font-Jakarta mb-5">
                            We've sent a verification code to {form.email}
                        </Text>
                        <InputField
                            label="Code"
                            icon={icons.lock}
                            placeHolder="1234.."
                            value={verification.code}
                            keyboardType="numeric"
                            onChangeText={(code) =>
                                setVerification({ ...verification, code })
                            }
                        />
                        {verification.error && (
                            <Text className="text-red-500 text-sm mt-1">
                                {verification.error}
                            </Text>
                        )}
                        <CustomButton
                            title="Verify email"
                            onPress={onPressVerify}
                            className="mt-5 bg-success-500"
                        />
                    </View>
                </ReactNativeModal>
                <ReactNativeModal isVisible={showSuccessModal}>
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                        <Image
                            source={images.check}
                            className="w-[110px] h-[110px] mx-auto my-5"
                        />
                        <Text className="text-3xl font-JakartaBold text-center">
                            Verified!
                        </Text>
                        <Text className="text-base text-gray-400 font-Jakarta text-center mt-2 mb-4">
                            You have successfully verified yout account
                        </Text>
                        <CustomButton
                            title="Browse Home"
                            onPress={() => {
                                setShowSuccessModal(false)
                                router.push('/(root)/(tabs)/home')
                            }}
                        />
                    </View>
                </ReactNativeModal>
            </View>
        </ScrollView>
    );
};

export default SignUp;
