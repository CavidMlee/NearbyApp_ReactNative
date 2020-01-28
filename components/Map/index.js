import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import Permissions from 'react-native-permissions'
import Geolocation from '@react-native-community/geolocation';
import { API_ENDPOINT, API_KEY, GOOGLE_MAPS_APIKEY } from '../../constant'
import axios from 'axios'
import Places from '../Places'
import MapViewDirections from 'react-native-maps-directions';

const Map = () => {

    const mapRef = useRef(null)
  
    const [region, setRegion] = useState({
      latitude: 40.409264,
      longitude: 49.867092,
      latitudeDelta: 0.0350,
      longitudeDelta: 0.0300,
    })
    const [coordinates, setCoordinates] = useState([])
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(false)
    const [typeMap, setTypeMap] = useState('standard')
    const [result, setResult] = useState(null)
  
    const { width, height } = Dimensions.get('window')
  
  
    useEffect(() => {
      try {
        Permissions.request('android.permission.ACCESS_FINE_LOCATION')
          .then(async respons => {
            const { coords } = await getCurrentPosition()
  
  
            axios.get(`${API_ENDPOINT}/nearbysearch/json?location=${coords.latitude},${coords.longitude}&radius=1000&type=restaurant&key=${API_KEY}`).
              then((places) => setPlaces(places.data.results),
                setLoading(false)
              )
  
  
  
            setRegion({
              ...region,
              latitude: coords.latitude,
              longitude: coords.longitude
            })
          })
      } catch (error) {
        alert("Location not found")
        setLoading(false)
      }
  
    }, [])
  
    const getCurrentPosition = () => {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(position => {
          resolve(position)
        }),
          reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000
        }
      })
  
    }
  
    const Direction = (destination) => {
      setCoordinates(
        [
          region,
          destination
        ]
      )
    }
  
    const mapType = (type) => {
      setTypeMap(type)
    }
  
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          loadingEnabled={true}
          mapType={typeMap}
          style={{ flex: 1 }}
          initialRegion={region}
          ref={mapRef}
        >
          {
            places.map(place => {
              const { geometry: { location: { lat, lng } } } = place
              console.log(place)
              return (
                <Marker
                  onPress={e => Direction(e.nativeEvent.coordinate)}
                  key={place.id}
                  coordinate={{
                    latitude: lat,
                    longitude: lng
                  }}
                  title={place.name}
                  description={place.vicinity}
                />
              )
            })
          }
          {coordinates.length > 1 &&
            <MapViewDirections
              origin={coordinates[0]}
              destination={coordinates[coordinates.length - 1]}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="#46b3e6"
              mode="WALKING"
              onReady={result => {
                console.log(`Distance: ${result.distance} km`)
                console.log(`Duration: ${result.duration} min.`)
                setResult(result)
  
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (width / 30),
                    bottom: (height / 30),
                    left: (width / 30),
                    top: (height / 30),
                  }
                });
              }}
            />
          }
        </MapView>
        {loading ?
          <View style={styles.loadingContainer}>
            <View style={styles.loadingView}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
  
          </View>
          : null}
        <View style={styles.placesContainer}>
          <Places map={mapRef} places={places} direction={Direction} />
        </View>
        <TouchableOpacity style={styles.terrainBtn} onPress={() => mapType('terrain')}>
          <Text>Terrain</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.satelliteBtn} onPress={() => mapType('satellite')}>
          <Text>Satellite</Text>
        </TouchableOpacity>
        {result &&
          <View style={styles.mapInfo}>
            <Text>{`${Math.round(result.distance*100)/100} km`}</Text>
            <Text>{`${Math.round(result.duration*100)/100} min`}</Text>
          </View>
        }
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    placesContainer: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%'
  
    },
    loadingContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '30%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      fontSize: 18,
    },
    loadingView: {
      padding: 5,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.7,
      borderRadius: 5
    },
    terrainBtn: {
      position: 'absolute',
      top: 0,
      left: 0,
      marginTop: 20,
      marginLeft: 15,
      width: '20%',
      height: 'auto',
      padding: 5,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
    },
    satelliteBtn: {
      position: 'absolute',
      top: 0,
      left: 0,
      marginTop: 60,
      marginLeft: 15,
      width: '20%',
      height: 'auto',
      padding: 5,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
    },
    mapInfo: {
      position: 'absolute',
      top: 0,
      right: 0,
      marginTop: 20,
      marginRight: 15,
      width: '20%',
      height: 'auto',
      padding: 5,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
    }
  });
  
  export default Map;