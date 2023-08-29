import {View, Text} from 'react-native';
import React from 'react';

const NotFound = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 20, color: 'grey', fontWeight: '600'}}>
        Data Not Found
      </Text>
    </View>
  );
};

export default NotFound;
