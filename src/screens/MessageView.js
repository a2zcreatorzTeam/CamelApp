import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {Card} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import * as ArabicText from '../language/EnglishToArabic';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
import camelapp from '../api/camelapp';
import {connect, useSelector} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {DataContext, getChatMessages} from '../context/DataContext';
import {firebaseService} from '../services';
import {useCallback} from 'react';

// class MessageView extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dataSource: [],
//       isLoading: true,
//       inputValue: '',
//       reciever_id: props.route.params.messageData.id,
//     };
//   }

//   componentDidMount() {
//     console.log('chattt');
//     // this.interval =
//     //     setInterval(() => {

//     //         this.getChatMessages();

//     //     }, 5000)
//     //console.log("props.route.params.messageData.sender_id", this.props.route.params.messageData.id);
//     this.getChatMessages();
//   }
//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }

//   getChatMessages = async () => {
//     let {user} = this.props;

//     //console.log("user", user.user.user);

//     let sender_id = user.user.user.id;

//     let reciever_id = this.props.route.params.messageData.id;

//     await camelapp
//       .get('/getmsgchat/' + sender_id + '/' + reciever_id)
//       .then(response => {
//         //console.log("response getChatMessages", response.data);

//         this.setState({dataSource: response.data});
//       });
//   };

//   _renderItem = ({item, index}) => {
//     let {user} = this.props;

//     let sender_id = user.user.user.id;

//     //console.log("item", item)
//     return item.sender_id == sender_id ? (
//       <Card style={Styles.text_send}>
//         <Text style={{color: '#fff', textAlign: 'right', fontSize: 14}}>
//           {item.message}
//         </Text>
//         <Text style={{color: 'black', fontSize: 10}}>{item.created_at}</Text>
//       </Card>
//     ) : (
//       <Card style={Styles.text_send_right}>
//         <Text style={{color: '#d2691e', fontSize: 14}}>{item.message}</Text>
//         <Text style={{color: 'gray', textAlign: 'right', fontSize: 10}}>
//           {item.created_at}
//         </Text>
//       </Card>
//     );
//   };

//   sendMessage = () => {
//     let {user} = this.props;

//     //console.log("user", user.user.user);

//     let sender_id = user.user.user.id;

//     let reciever_id = this.props.route.params.messageData.id;

//     if (this.state.inputValue != '') {
//       camelapp
//         .post('/sendmsg', {
//           sender_id: sender_id,
//           reciever_id: reciever_id,
//           message: this.state.inputValue,
//         })
//         .then(response => {
//           //console.log('send message response', response);

//           this.setState({inputValue: ''});
//           this.getChatMessages();
//         });
//     }
//   };
//   handlePress = useCallback(
//     function () {
//       setIsLoading(true);
//       firebaseService.createMessage({message, uid}).then(function () {
//         setIsLoading(false);
//         setMessage('');
//       });
//     },
//     [message],
//   );

//   render() {
//     return (
//       <View
//         //style={Styles.containerMessageView}
//         style={{flex: 1, width: width, height: hight}}>
//         <FlatList
//           data={this.state.dataSource}
//           renderItem={this._renderItem}
//           keyExtractor={(item, index) => index.toString()}
//         />

//         <View style={Styles.msgbar}>
//           <TouchableOpacity
//             style={{left: 5, position: 'absolute', bottom: 0, marginRight: 10}}>
//             <Feather
//               name="send"
//               size={30}
//               color="#D2691E"
//               style={{
//                 left: 5,
//                 position: 'absolute',
//                 bottom: 7,
//                 marginTop: 40,
//                 transform: [{rotate: '225deg'}],
//               }}
//               onPress={() => this.sendMessage()}
//             />
//           </TouchableOpacity>
//           <TextInput
//             style={Styles.msginput}
//             placeholder={ArabicText.message}
//             placeholderTextColor="#b0b0b0"
//             onChangeText={text => this.setState({inputValue: text})}
//             value={this.state.inputValue}></TextInput>
//         </View>
//       </View>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   user: state.user,
// });

// const ActionCreators = Object.assign({}, userActions);
// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(MessageView);

const MessageView = ({route}) => {
  // dataSource: [],
  //       isLoading: true,
  //       inputValue: '',
  //       reciever_id: props.route.params.messageData.id,
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const reciever_id = route.params.messageData.id;
  const user_id = useSelector(state => state?.user?.user?.user?.id);
  handlePress =
    useCallback();
    // function () {
    //   console.log(inputValue, reciever_id, 'rereree');
    //   setIsLoading(true);
    //   firebaseService
    //     .createMessage({message: inputValue, uid: reciever_id})
    //     .then(function () {
    //       setIsLoading(false);
    //       setInputValue('');
    //     });
    // },
    // [inputValue],

  const listenForMessages = (roomId, callback) => {
    const messageRef = firebase.database().ref(`/chatRooms/${roomId}/messages`);
    messageRef.on('child_added', snapshot => {
      const messageData = snapshot.val();
      callback(messageData);
    });
  };

  //   useEffect(
  //     function () {
  //       return firebaseService.messageRef
  //         .orderBy('created_at', 'desc')
  //         .onSnapshot(function (snapshot) {
  //           console.log(snapshot?.docs, 'snapshotsnapshot');
  //           //   dispatchMessages({type: 'add', payload: snapshot.docs});
  //         });
  //     },
  //     [false],

  useEffect(() => {
    // firebaseService
    //   .checkOrCreateChatRoom(user_id, reciever_id)
    //   .then(function () {
    //     console.log('checkOrCreateChatRoom');
    //   });
    //     listenForMessages(roomId, message => {
    //       // Update the chat interface with the new message
    //       //   updateChatInterface(message);
    //     });
    //   }, [roomId]
  });
  //   );

  _renderItem = ({item, index}) => {
    let {user} = this.props;
    let sender_id = user.user.user.id;
    return item.sender_id == sender_id ? (
      <Card style={Styles.text_send}>
        <Text style={{color: '#fff', textAlign: 'right', fontSize: 14}}>
          {item.message}
        </Text>
        <Text style={{color: 'black', fontSize: 10}}>{item.created_at}</Text>
      </Card>
    ) : (
      <Card style={Styles.text_send_right}>
        <Text style={{color: '#d2691e', fontSize: 14}}>{item.message}</Text>
        <Text style={{color: 'gray', textAlign: 'right', fontSize: 10}}>
          {item.created_at}
        </Text>
      </Card>
    );
  };

  return (
    <View
      //style={Styles.containerMessageView}
      style={{flex: 1, width: width, height: hight}}>
      <FlatList
        data={dataSource}
        renderItem={this._renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={Styles.msgbar}>
        <TouchableOpacity
          style={{left: 5, position: 'absolute', bottom: 0, marginRight: 10}}>
          <Feather
            name="send"
            size={30}
            color="#D2691E"
            style={{
              left: 5,
              position: 'absolute',
              bottom: 7,
              marginTop: 40,
              transform: [{rotate: '225deg'}],
            }}
            onPress={() => handlePress()}
          />
        </TouchableOpacity>
        <TextInput
          style={Styles.msginput}
          placeholder={ArabicText.message}
          placeholderTextColor="#b0b0b0"
          onChangeText={text => setInputValue(text)}
          value={inputValue}></TextInput>
      </View>
    </View>
  );
};

export default MessageView;
