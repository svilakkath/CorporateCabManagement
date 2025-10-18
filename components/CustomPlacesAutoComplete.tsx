import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

export type MyLocation = {
    latitude: number;
    longitude: number;
    address: string;
};

type SearchInputProps = {
    data: MyLocation[];
    placeholder?: string;
    onPress?: (location: MyLocation) => void;
    icon?: any;
    initialLocation?: string | null;
    containerStyle?: ViewStyle;
    textInputBackgroundColor?: string;
};

const CustomPlacesAutoComplete = ({
    data,
    placeholder = 'Search...',
    onPress,
    icon,
    initialLocation,
    containerStyle,
    textInputBackgroundColor,
}: SearchInputProps) => {
    const [query, setQuery] = useState('');
    const [filteredData, setFilteredData] = useState<MyLocation[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(
        initialLocation || null,
    );

    useEffect(() => {
        if (initialLocation) {
            setSelectedLocation(initialLocation);
        }
    }, [initialLocation]);

    const handleInputChange = (text: string) => {
        setQuery(text);
        if (text) {
            const results = data.filter((item) =>
                item.address.toLowerCase().includes(text.toLowerCase()),
            );
            setFilteredData(results);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelect = (item: MyLocation) => {
        setSelectedLocation(item.address);
        setQuery('');
        setShowSuggestions(false);
        if (onPress) {
            onPress(item);
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.inputContainer]}>
                {icon && (
                    <View style={styles.iconContainer}>
                        <Image source={icon} style={styles.icon} resizeMode="contain" />
                    </View>
                )}
                <TextInput
                    style={[styles.textInput, { color: textInputBackgroundColor }]}
                    placeholder={selectedLocation || placeholder} // Show selected location as placeholder
                    value={query} // Query stays empty after a selection
                    onChangeText={handleInputChange}
                    placeholderTextColor="gray"
                />
            </View>
            {showSuggestions && (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => handleSelect(item)}
                        >
                            <Text style={styles.suggestionText}>{item.address}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        shadowColor: '#d4d4d4',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        paddingHorizontal: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        paddingVertical: 10,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    icon: {
        width: 24,
        height: 24,
    },
    suggestionsList: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        shadowColor: '#d4d4d4',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    suggestionItem: {
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    suggestionText: {
        fontSize: 16,
    },
});

export default CustomPlacesAutoComplete;
