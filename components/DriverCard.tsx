import { icons } from '@/constants';
import { formatTime } from '@/lib/utils';
import { DriverCardProps } from '@/types/type';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {
    const isSelected = selected === item.id;

    return (
        <TouchableOpacity
            onPress={setSelected}
            style={[
                styles.card,
                isSelected ? styles.selectedCard : styles.defaultCard,
            ]}
        >
            {/* Driver Profile Image */}
            <Image
                source={{ uri: item.profile_image_url }}
                style={styles.profileImage}
            />

            {/* Driver Info */}
            <View style={styles.infoContainer}>
                {/* Title and Rating */}
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.ratingContainer}>
                        <Image source={icons.star} style={styles.icon} />
                        <Text style={styles.ratingText}>4</Text>
                    </View>
                </View>

                {/* Price, Time, and Seats Info */}
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Image source={icons.dollar} style={styles.icon} />
                        <Text style={styles.detailText}>${item.price}</Text>
                    </View>
                    <Text style={styles.separator}>|</Text>
                    <Text style={styles.detailText}>{formatTime(parseInt(`${item.time}`))}</Text>
                    <Text style={styles.separator}>|</Text>
                    <Text style={styles.detailText}>{item.car_seats} seats</Text>
                </View>
            </View>

            {/* Car Image */}
            <Image
                source={{ uri: item.car_image_url }}
                style={styles.carImage}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginVertical: 8,
    },
    selectedCard: {
        backgroundColor: '#48BB77', // bg-general-600 equivalent
    },
    defaultCard: {
        backgroundColor: '#FFFFFF',
    },
    profileImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    infoContainer: {
        flex: 1,
        marginHorizontal: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    icon: {
        width: 14,
        height: 14,
    },
    ratingText: {
        fontSize: 14,
        marginLeft: 4,
        color: '#4A5568',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 14,
        marginLeft: 4,
        color: '#4A5568', // text-general-800 equivalent
    },
    separator: {
        fontSize: 14,
        color: '#4A5568',
        marginHorizontal: 8,
    },
    carImage: {
        width: 56,
        height: 56,
    },
});

export default DriverCard;
