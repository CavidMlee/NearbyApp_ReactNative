import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { API_ENDPOINT, API_KEY } from '../../constant'

const PlacesItem = (props) => {
    const { photos, name } = props.item;
    let source;
    if (photos) {
        source = { uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photos[0].photo_reference}&key=${API_KEY}` }
    }
    else {
        source = require('../assets/noImage.png')
    }

    const onPress=()=>{
        const{lat,lng}= props.item.geometry.location

        const newRegion = {
            latitude:lat,
            longitude:lng,
            latitudeDelta:0.008,
            longitudeDelta:0.008
        }

        props.map.current.animateToRegion(newRegion,1000)
        props.direction(newRegion)

    }
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.itemContainer}>
                <Text numberOfLines={1} style={styles.text}>{name}</Text>
                <Image
                    style={styles.photo}
                    source={source}
                />
            </View>
        </TouchableOpacity>

    )

}

const styles = StyleSheet.create({
    itemContainer: {
        width: 200,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 10

    },
    photo: {
        width: '100%',
        height: 120,
        position: 'absolute',
        left: 0,
        top: 0,
        borderRadius: 10
    },
    text: {
        padding: 5,
        backgroundColor: 'white',
        borderBottomRightRadius: 5,
        borderTopLeftRadius:5,
        opacity: 0.8,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2
    }
})

export default PlacesItem;
