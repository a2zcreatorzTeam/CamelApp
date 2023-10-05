import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import camelapp from '../../api/camelapp';
import {ScrollView} from 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import firebaseConfig, {db} from '../../components/firebase';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
// import { connect, useSelector } from 'react-redux';
// import * as userActions from '../../redux/actions/user_actions';
// import { bindActionCreators } from 'redux';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const CreateGroup = props => {
  const [friendlist, setFriendList] = useState([]);
  const [newParticipant, setNewParticipant] = useState([]);
  const [groupName, setGroupName] = useState('');
  // const getUser = useSelector(userReducer)

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
        console.log('keyboardDidShow');
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
        console.log('keyboard hidden');
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  let {userID, refreshGrouplist} = props.route.params;
  console.log(userID, 'userID');

  const addGroupUser = prop => {
    // //PUSH in useState Array of Objects
    setNewParticipant(item => [...item, prop]);
    // //Remove User from Array

    setFriendList(
      friendlist.filter(item => item?.firend_id !== prop?.firend_id),
    );
  };

  const removeGroupUser = prop => {
    // //Remove User from Array
    setNewParticipant(
      newParticipant.filter(item => item?.firend_id !== prop?.firend_id),
    );
    // //PUSH in useState Array of Objects
    setFriendList(item => [...item, prop]);
  };

  // // FETCH Friendlist Data
  const getFriendlist = async () => {
    try {
      // userID user id statc
      console.log(userID,"GJGJG")
      const fetchfriendlist = await camelapp.get('/friendlist/' + userID);
      console.log(fetchfriendlist?.data, 'fetchfriendlist');
      setFriendList(fetchfriendlist?.data);
    } catch (error) {
      console.log(error?.response, '=====ERROR OF FRIEND LIST API===');
    }
  };

  // const createGroup = async () => {
  //     let tempArray = [];

  //     newParticipant.forEach(e => {
  //         tempArray.push(e.user.id)
  //     });
  //     // console.log(tempArray, "---tempArray");
  //     // console.log(groupName, "---groupName");

  //     if (groupName === "") {
  //         return alert("Please Enter Group Name")
  //     }
  //     if (tempArray.length === 0) {
  //         return alert("Please add participants")
  //     }
  //     try {
  //         await camelapp.post("/creategroup", {
  //             "user_id": userID,
  //             "name": groupName,
  //             "participants": tempArray,
  //         })
  //             .then((res) => {
  //                 if (res?.data?.status === true) {
  //                     props.navigation.goBack()
  //                     refreshGrouplist();
  //                     console.log("Group Created Successfully");
  //                 } else {
  //                     console.log("group creation failed");
  //                 }
  //             })
  //     } catch (error) {
  //         console.log(error, "create Group error");
  //     }
  // }

  //     const createGroup= async()=>{
  //      console.log(firebase.apps)
  //     if (!firebase.apps.length) {
  //         console.log("1")
  //       firebase.initializeApp(firebaseConfig);
  //     } else {
  //         console.log("2")
  //       firebase.app();
  //     }
  //     if(firebase.apps?.length){

  //  console.log("GERERE")
  // //  const database = await getFirestore();

  //         let { userID, refreshGrouplist } = props.route.params
  //         console.log(userID, "userID");
  //         // const newRef = collection(db, "chats")
  //         const collectionRef = firestore().collection('chats');
  //         setDoc(collectionRef, {
  //             lastUpdated: Date.now(),
  //             users: userID,
  //             messages: [],
  //             groupName: groupName, //TODO admin can set group name
  //             // groupAdmins: [auth?.currentUser?.email] //TODO can change group admins later
  //         }).then(
  //             console.log("IM HERER")
  //             // navigation.navigate('Chat', { id: newRef.id, chatName: groupName })
  //         )
  //     }
  //     }

  const createGroup = async () => {
    let {userID, refreshGrouplist} = props.route.params;
    let tempArrayForUserDetails = [];
    tempArrayForUserDetails.push({id:userID, message:""})
        if (groupName === "") {
          return alert("Please Enter Group Name")
      }
    if(newParticipant?.length==0){
        alert("Please select a participant")
    } 
    let tempArray = [];


        newParticipant?.forEach(e => {
 
            tempArray.push(e?.firend_id)
            tempArrayForUserDetails.push({id:e?.firend_id,message:''})
        });
        if(tempArray?.length){

        
    try {
      const collectionRef = firestore().collection('groupChat'); // Replace with your actual collection name
      const documentData = {
        lastUpdated: Date.now(),
        users: userID,
        members:tempArray,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        messages: [],
        groupUserDetails:tempArrayForUserDetails,
        groupName: groupName, //TODO admin can set group name
        // groupAdmins: [auth?.currentUser?.email] //TODO can change group admins later
      }; // Replace with your actual document data

      await collectionRef.add(documentData);
      console.log('Document added successfully');
      props.navigation.goBack()
      console.log("Group Created Successfully");
    //   queryDocumentsInCollection();
    } catch (error) {
      console.error('Error adding document:', error);
    }
}
  };

  //get all document details
  const queryDocumentsInCollection = async () => {
    try {
      const collectionRef = firestore().collection('groupChat'); // Replace with your actual collection name

      const querySnapshot = await collectionRef.get();

      querySnapshot.forEach(documentSnapshot => {
        console.log('Document ID:', documentSnapshot?.id);
        const documentReference = collectionRef.doc(documentSnapshot?.id);
        console.log(documentReference, 'documentReference');
      });
    } catch (error) {
      console.error('Error querying documents:', error);
    }
  };






  useEffect(() => {
  
    getFriendlist();
  }, []);

  console.log(newParticipant, '23newParticipant1234');

  return (
    <View style={{flex: 1}}>
      <View style={{height: '60%'}}>
        <ScrollView contentContainerStyle={{paddingBottom: 40}}>
          {/* Create Group Section */}
          <View style={styles.createGroupSection}>
            {/* <Image source={require("../../../assets/splashimg.png")} style={{ width: 70, height: 70, borderRadius: 50 }} /> */}

            <TextInput
              placeholder="Group Name"
              placeholderTextColor="grey"
              style={styles.inputField}
              onChangeText={e => setGroupName(e)}
            />

            <TouchableOpacity
              onPress={createGroup}
              style={styles.createGroupBTN}>
              <Text style={{color: '#fff', fontSize: 15}}>Create Group</Text>
            </TouchableOpacity>
          </View>

          {/* Group UserList */}
          {newParticipant?.length ? (
            <View style={{width: width, alignItems: 'center', marginTop: -40}}>
              <FlatList
                data={newParticipant}
                nestedScrollEnabled={true}
                renderItem={({item}) => (
                  <NewUserComp
                    item={item}
                    removeGroupUser={removeGroupUser}
                    newUser={item}
                  />
                )}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>

      {/* FriendList */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          zIndex: 30,
          backgroundColor: '#ddd',
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          display: isKeyboardVisible == false ? 'flex' : 'none',
        }}>
        <ScrollView
          style={{
            width: width,
            height: 280,
          }}>
          <FlatList
            data={friendlist}
            nestedScrollEnabled={true}
            contentContainerStyle={{}}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            renderItem={({item}) => (
              <UserComp item={item} addGroupUser={addGroupUser} />
            )}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const UserComp = ({item, addGroupUser, newUser}) => {
  // console.log(item.name, "====");

  return (
    <>
      {/* {newUser?.user?.name !== item?.name ? ( */}
      <View style={styles.userContainer}>
        <View style={styles.userImageContainer}>
          <Image
            source={{
              uri:
                'http://www.tasdeertech.com/public/images/profiles/' +
                item?.firend_image,
            }}
            style={styles.userImageStyle}
          />
        </View>

        <View>
          <Text style={styles.userName}>{item?.firend_name}</Text>
        </View>

        <View style={{position: 'absolute', right: 15}}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.addBTN}
            onPress={() => addGroupUser(item)}>
            <Text style={{color: '#fff'}}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* ) : null} */}
    </>
  );
};

const NewUserComp = ({item, removeGroupUser, newUser}) => {
  console.log('===jhkhkhk=dd=', item);

  return (
    <View style={styles.userContainer}>
      <View style={styles.userImageContainer}>
        <Image
          source={{
            uri:
              'http://www.tasdeertech.com/public/images/profiles/' +
              item?.firend_image,
          }}
          style={styles.userImageStyle}
        />
      </View>

      <View>
        <Text style={styles.userName}>{item?.firend_name}</Text>
      </View>

      <View style={{position: 'absolute', right: 15}}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.addBTN}
          onPress={() => removeGroupUser(item)}>
          <Text style={{color: '#fff'}}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// const mapStateToProps = state => ({
//     user: state.user
// });

// const ActionCreators = Object.assign(
//     {},
//     userActions
// );
// const mapDispatchToProps = dispatch => ({
//     actions: bindActionCreators(ActionCreators, dispatch),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
export default CreateGroup;

const styles = StyleSheet.create({
  createGroupSection: {
    width: width,
    alignItems: 'center',
    // justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 200,
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 20,
    zIndex: 50,
    // position:"absolute",
    // top:20,
  },
  inputField: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D2691E',
    borderRadius: 5,
    textAlign: 'right',
    paddingHorizontal: 15,
    color: '#000',
    marginBottom: 30,
  },
  createGroupBTN: {
    width: 150,
    height: 45,
    backgroundColor: '#D2691E',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    width: width,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D2691E',
  },
  userName: {
    color: '#000',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'right',
  },
  userImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#D2691E',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  userImageStyle: {
    width: '95%',
    height: '95%',
    resizeMode: 'contain',
    borderRadius: 25,
  },
  addBTN: {
    height: 27,
    backgroundColor: '#D2691E',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
});
