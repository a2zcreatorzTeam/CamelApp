import React from 'react';
import {View, Text} from 'react-native';

const EmptyComponent = ({text}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'black', textAlign:'center'}}>No data found</Text>
    </View>
  );
};

export default EmptyComponent;
