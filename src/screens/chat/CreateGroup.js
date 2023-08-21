import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard, Dimensions, Image } from "react-native";
import React, { useEffect, useState } from "react";
import camelapp from "../../api/camelapp";
import { ScrollView } from "react-native-gesture-handler";
// import { connect, useSelector } from 'react-redux';
// import * as userActions from '../../redux/actions/user_actions';
// import { bindActionCreators } from 'redux';

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

const CreateGroup = (props) => {
    const [friendlist, setFriendList] = useState([])
    const [newParticipant, setNewParticipant] = useState([])
    const [groupName, setGroupName] = useState("")
    // const getUser = useSelector(userReducer)


    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
                console.log("keyboardDidShow")
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
                console.log("keyboard hidden")
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);







    let { userID, refreshGrouplist } = props.route.params
    console.log(userID, "userID");


    const addGroupUser = (prop) => {
        // //PUSH in useState Array of Objects
        setNewParticipant(item => [...item, { user: prop }])
        // //Remove User from Array
        setFriendList(friendlist.filter(item => item.id !== prop.id))
    }

    const removeGroupUser = (prop) => {
        // //Remove User from Array
        setNewParticipant(newParticipant.filter(item => item.user.id !== prop.id))
        // //PUSH in useState Array of Objects
        setFriendList(item => [...item, prop]
        )
    }

    // // FETCH Friendlist Data
    const getFriendlist = async () => {
        try {
            const fetchfriendlist = await camelapp.get("/friendlist/" + userID);
            setFriendList(fetchfriendlist?.data?.data)
        } catch (error) {
            console.log(error, "=====ERROR OF FRIEND LIST API===");
        }
    }

    const createGroup = async () => {
        let tempArray = [];

        newParticipant.forEach(e => {
            tempArray.push(e.user.id)
        });
        // console.log(tempArray, "---tempArray");
        // console.log(groupName, "---groupName");

        if (groupName === "") {
            return alert("Please Enter Group Name")
        }
        if (tempArray.length === 0) {
            return alert("Please add participants")
        }
        try {
            await camelapp.post("/creategroup", {
                "user_id": userID,
                "name": groupName,
                "participants": tempArray,
            })
                .then((res) => {
                    if (res?.data?.status === true) {
                        props.navigation.goBack()
                        refreshGrouplist();
                        console.log("Group Created Successfully");
                    } else {
                        console.log("group creation failed");
                    }
                })
        } catch (error) {
            console.log(error, "create Group error");
        }
    }

    useEffect(() => {
        getFriendlist()
    }, [])

    return (
        <View style={{ flex: 1 }}>
        <View style={{height:"60%"}}>
             <ScrollView contentContainerStyle={{paddingBottom:40}}>

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
                        <Text style={{ color: "#fff", fontSize: 15 }}>
                            Create Group
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Group UserList */}
                <View style={{ width: width, alignItems: "center", marginTop:-40 }}>
                    <FlatList
                        data={newParticipant}
                        nestedScrollEnabled={true}

                        renderItem={({ item }) =>
                            <NewUserComp
                                item={item?.user}
                                removeGroupUser={removeGroupUser}
                                newUser={item}
                            />
                        }
                    />
                </View>
            </ScrollView>
        </View>
           

            {/* FriendList */}
            <View style={{
                position: "absolute",
                bottom: 0,
                zIndex: 30,
                backgroundColor: "#ddd",
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
                display: isKeyboardVisible == false ? "flex" : "none",
            }}>
                <ScrollView style={{
                    width: width,
                    height: 280,
                }}>
                    <FlatList
                        data={friendlist}
                        nestedScrollEnabled={true}
                        contentContainerStyle={{

                        }}

                        initialNumToRender={5}
                        maxToRenderPerBatch={5}
                        renderItem={({ item }) =>
                            <UserComp
                                item={item}
                                addGroupUser={addGroupUser}
                            />}
                    />
                </ScrollView>

            </View>
        </View>
    );
};

const UserComp = ({ item, addGroupUser, newUser }) => {
    // console.log(item.name, "====");

    return (
        <>
            {/* {newUser?.user?.name !== item?.name ? ( */}
            <View style={styles.userContainer}>

                <View style={styles.userImageContainer}>
                    <Image source={{ uri: "http://www.tasdeertech.com/public/images/profiles/" + item?.image }}
                        style={styles.userImageStyle} />
                </View>

                <View>
                    <Text style={styles.userName}>{item?.name}</Text>
                </View>

                <View style={{ position: "absolute", right: 15 }}>
                    <TouchableOpacity
                        activeOpacity={0.50}
                        style={styles.addBTN}
                        onPress={() => addGroupUser(item)}
                    >
                        <Text style={{ color: "#fff" }}>
                            Add
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* ) : null} */}
        </>

    )
}

const NewUserComp = ({ item, removeGroupUser, newUser }) => {
    // console.log("=====", newUser?.user?.name);

    return (
        <View style={styles.userContainer}>

            <View style={styles.userImageContainer}>
                <Image source={{ uri: "http://www.tasdeertech.com/public/images/profiles/" + item?.image }}
                    style={styles.userImageStyle} />
            </View>

            <View>
                <Text style={styles.userName}>{item?.name}</Text>
            </View>

            <View style={{ position: "absolute", right: 15 }}>
                <TouchableOpacity
                    activeOpacity={0.50}
                    style={styles.addBTN}
                    onPress={() => removeGroupUser(item)}
                >
                    <Text style={{ color: "#fff" }}>
                        Remove
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

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
        alignItems: "center",
        // justifyContent: "space-between",
        paddingHorizontal: 10,
        height: 200,
        flexDirection: "column",
        marginTop: 20,
        marginBottom: 20,
        zIndex: 50,
        // position:"absolute",
        // top:20,
    },
    inputField: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#D2691E",
        borderRadius: 5,
        textAlign: "right",
        paddingHorizontal: 15,
        color: "#000",
        marginBottom:30
    },
    createGroupBTN: {
        width: 150, height: 45, backgroundColor: "#D2691E", borderRadius: 25, justifyContent: "center", alignItems: "center"
    },
    userContainer: {
        width: width, flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: "#D2691E"
    },
    userName: {
        color: "#000", fontWeight: "700", fontSize: 17, textAlign: "right"
    },
    userImageContainer: {
        width: 60, height: 60, borderRadius: 50, backgroundColor: "#D2691E", justifyContent: "center", alignItems: "center", marginLeft: 15
    },
    userImageStyle: {
        width: "95%", height: "95%", resizeMode: "contain", borderRadius: 25
    },
    addBTN: {
        height: 27, backgroundColor: "#D2691E", borderRadius: 15, justifyContent: "center", alignItems: "center", paddingHorizontal: 12
    }
});
