import {StyleSheet, TextInput, View, Button} from 'react-native';
import React, {useState, useContext} from 'react';
import {AuthContext} from '../../firebase/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import ChatLogin from './ChatLogin';

const ChatSignup = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation();
  const {register} = useContext(AuthContext);


  return (
    <View style={{flex: 1, padding: 25}}>
      <TextInput
        value={name}
        placeholder="Name"
        onChangeText={setName}
        style={styles.inputStyle}
      />
      <TextInput
        value={number}
        placeholder="Contact number"
        onChangeText={setNumber}
        style={styles.inputStyle}
        keyboardType={'numeric'}
      />
      <TextInput
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        style={styles.inputStyle}
        secureTextEntry={true}
      />
      <TextInput
        value={confirmPassword}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        style={styles.inputStyle}
        secureTextEntry={true}
      />
      <Button
        title="Sign Up"
        onPress={() => {
          //console.log('EMAIL', number + '@alsyahd.com');
          if (
            password === confirmPassword &&
            password?.length > 7 &&
            confirmPassword?.length > 7
          ) {
            register(number + '@alsyahd.com', password);
            navigation.navigate(ChatLogin);
          } else {
            //console.log('Password is not same or below then 7 letters');
          }
        }}
        color="#000"
      />
    </View>
  );
};

export default ChatSignup;

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
