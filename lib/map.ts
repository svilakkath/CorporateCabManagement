import { Driver, MarkerData } from '@/types/type';

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

// export const calculateDriverTimes = async ({
//   markers,
//   userLatitude,
//   userLongitude,
//   destinationLatitude,
//   destinationLongitude,
// }: {
//   markers: MarkerData[];
//   userLatitude: number | null;
//   userLongitude: number | null;
//   destinationLatitude: number | null;
//   destinationLongitude: number | null;
// }) => {
//   if (
//     !userLatitude ||
//     !userLongitude ||
//     !destinationLatitude ||
//     !destinationLongitude
//   ) {
//     console.error('Missing coordinates for calculation.');
//     return;
//   }

//   try {
//     const timesPromises = markers.map(async (marker) => {
//       try {
//         // Fetch time to user
//         const responseToUser = await fetch(
//           `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`,
//         );
//         const dataToUser = await responseToUser.json();

//         const timeToUser = dataToUser.routes?.[0]?.legs?.[0]?.duration?.value;
//         if (!timeToUser) {
//           console.warn(
//             `No route to user found for marker: ${JSON.stringify(marker)}`,
//           );
//           const mockData = {
//             routes: [
//               {
//                 legs: [
//                   {
//                     duration: {
//                       value: 600, // Mock value for 10 minutes
//                     },
//                   },
//                 ],
//               },
//             ],
//           };
//           const fallbackTimeToUser = mockData.routes[0].legs[0].duration.value;
//   console.log(`Using fallback timeToUser: ${fallbackTimeToUser}`);

//   return fallbackTimeToUser;

//           // return null; // Skip this marker
//         }

//         // Fetch time to destination
//         const responseToDestination = await fetch(
//           `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`,
//         );
//         const dataToDestination = await responseToDestination.json();

//         const timeToDestination =
//           dataToDestination.routes?.[0]?.legs?.[0]?.duration?.value;
//         if (!timeToDestination) {
//           console.warn(
//             `No route to destination found for marker: ${JSON.stringify(marker)}`,
//           );
//           return null; // Skip this marker
//         }

//         // Calculate total time and price
//         const totalTime = (timeToUser + timeToDestination) / 60; // Total time in minutes
//         const price = (totalTime * 0.5).toFixed(2); // Calculate price based on time

//         return { ...marker, time: totalTime, price };
//       } catch (markerError) {
//         console.error(`Error processing marker ${marker.id}:`, markerError);
//         return null; // Skip this marker
//       }
//     });

//     // Wait for all promises and filter out null results
//     const results = await Promise.all(timesPromises);
//     return results.filter((result) => result !== null);
//   } catch (error) {
//     console.error('Error calculating driver times:', error);
//   }
// };
export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  ) {
    console.error('Missing coordinates for calculation.');
    return;
  }

  try {
    const timesPromises = markers.map(async (marker) => {
      try {
        // Fetch time to user
        const responseToUser = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`,
        );
        const dataToUser = await responseToUser.json();

        const timeToUser =
          dataToUser.routes?.[0]?.legs?.[0]?.duration?.value ??
          (() => {
            console.warn(
              `No route to user found for marker: ${JSON.stringify(marker)}. Using mock data.`,
            );
            // Fallback to mock data
            return 600; // Mock time in seconds (10 minutes)
          })();

        // Fetch time to destination
        const responseToDestination = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`,
        );
        const dataToDestination = await responseToDestination.json();

        const timeToDestination =
          dataToDestination.routes?.[0]?.legs?.[0]?.duration?.value ??
          (() => {
            console.warn(
              `No route to destination found for marker: ${JSON.stringify(marker)}. Using mock data.`,
            );
            // Fallback to mock data
            return 900; // Mock time in seconds (15 minutes)
          })();

        // Calculate total time and price
        const totalTime = (timeToUser + timeToDestination) / 60; // Total time in minutes
        const price = (totalTime * 0.5).toFixed(2); // Calculate price based on time

        return { ...marker, time: totalTime, price };
      } catch (markerError) {
        console.error(`Error processing marker ${marker.id}:`, markerError);
        // Fallback for the whole marker if any error occurs
        return {
          ...marker,
          time: 25, // Mock total time in minutes
          price: '12.50', // Mock price
        };
      }
    });

    // Wait for all promises and filter out null results
    const results = await Promise.all(timesPromises);
    return results.filter((result) => result !== null);
  } catch (error) {
    console.error('Error calculating driver times:', error);
  }
};
