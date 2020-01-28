import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PlacesItem from './PlacesItem'

const Places = (props) => {


    return (
        <View style={styles.container}>
            <FlatList
                data={props.places}
                renderItem={({ item }) => <PlacesItem map={props.map} item={item} region={props.region} direction={props.direction} />}
                horizontal={true}
                ItemSeparatorComponent={()=><View style={{marginRight:10}} />}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: 140,
        padding: 10,
    }
})


export default Places