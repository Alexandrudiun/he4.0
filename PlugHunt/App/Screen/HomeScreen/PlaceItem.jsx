import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Pressable, Alert } from 'react-native';
import GlobalApi from '../../Utils/GlobalApi';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { app } from '../../Utils/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

export default function PlaceItem({ place, isFav, markedFav }) {
  const PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
  const { user } = useUser();
  const db = getFirestore(app);
  const onSetFav = async (place) => {
    if (place && place.id) {
      await setDoc(doc(db, "favorites", place.id.toString()), {
        place: place,
        email: user?.primaryEmailAddress?.emailAddress
      });
      markedFav();
      Alert.alert('Favorite Added', 'Added to Favorites!');
    } else {
      Alert.alert('Error', 'Favorite could not be added. Missing place ID.');
    }
  }

  const openInGoogleMaps = () => {
    const { latitude, longitude } = place.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={{
      backgroundColor: '#fff',
      margin: 10,
      borderRadius: 10,
    }}>
      <Pressable style={{
        position: 'absolute',
        right: 0,
        margin: 5,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      }} onPress={() => onSetFav(place)}>
        {isFav ?
          <FontAwesome6 name="heart-circle-bolt" size={30} color="red" />
          : <FontAwesome6 name="heart-circle-bolt" size={30} color="#fff" />
        }
      </Pressable>
      <Image
        source={
          place?.photos && place.photos.length > 0
            ? { uri: `${PHOTO_BASE_URL}${place.photos[0]?.name}/media?key=${GlobalApi.API_KEY}&maxHeightPx=800&maxWidthPx=1200` }
            : require('./../../../assets/images/charger.jpg')
        }
        style={{
          width: '100%',
          borderRadius: 10,
          height: 150,
          zIndex: -1
        }}
      />
      <View style={{ padding: 15 }}>
        <Text
          style={{
            fontSize: 23,
            fontFamily: 'Poppins-Medium',
          }}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {place?.displayName?.text || 'No Name Available'}
        </Text>
        <Text
          style={{
            color: '#aaa',
            fontFamily: 'Poppins-ExtraLight',
          }}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {place?.formattedAddress || 'No Address Available'}
        </Text>
        <View style={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <View>
            <Text
              style={{
                fontFamily: 'Poppins-ExtraLight',
                color: '#aaa',
                fontSize: 13,
              }}
            >
              Connectors:
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 20,
                marginTop: 2,
              }}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {place?.evChargeOptions?.connectorCount || 'Unknown number'} Points
            </Text>
          </View>
          <TouchableOpacity onPress={openInGoogleMaps} style={{
            padding: 12,
            backgroundColor: '#7099BE',
            borderRadius: 10,
            paddingHorizontal: 14
          }}>
            <MaterialCommunityIcons name="send-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
