import {StyleSheet, Platform, StatusBar} from 'react-native';
import {Dimensions} from 'react-native';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
  },
  headingPostText: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2691Eff',
  },
  video: {width: '100%', height: 400, borderWidth: 1, backgroundColor: 'black'},
  imageCarousal: {
    width: width,
    height: hight / 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // overflow: 'hidden',
  },
  containerBidsItem: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    height: 100,
    width: width,
    alignItems: 'center',
  },
  containerSponsor: {
    // backgroundColor: '#ffffff',
    width: width,
  },
  WinnerIcon: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 2,
    marginBottom: 10,
    borderColor: 'white',
    marginTop: 5,
  },
  containerFollowing: {
    backgroundColor: '#DCDCDC',
    // alignItems: 'center',
    // justifyContent: 'center',
    width: width,
  },
  containerSellingCamel: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
  },
  containerMessageView: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    // width: width,
    // right: 10
  },
  containerNews: {
    flex: 1,
    // backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
  },
  floatIcon: {
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d2691e',
    borderWidth: 2,
  },
  containerComments: {
    flex: 1,
    backgroundColor: '#ffffff',

    width: width,
    height: hight,
  },

  containerHome: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
  },
  containerScroll: {
    flex: 1,
    backgroundColor: '#ffffff',
    // marginTop: 50,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerDetails: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    // justifyContent: 'center',

    width: width,
    // height: hight
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#d2691e',
    alignSelf: 'center',
  },
  inputs: {
    height: 40,
    width: width - 80,
    borderBottomColor: '#d2691e',
    borderBottomWidth: 1,
    textAlign: 'right',
    color: 'black',
  },
  inputsign: {
    margin: 5,
    height: hight / 40,
    width: width / 3,
    borderColor: '#d2691e',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  card: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 7},
    shadowOpacity: 0.27,
    shadowRadius: 25,
    backgroundColor: 'white',
    width: width - 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    height: 300,
  },
  btn: {
    height: 45,
    width: width / 1.3,
    borderRadius: 10,
    backgroundColor: '#8b4513',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
  textbtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  header: {
    backgroundColor: '#d2691e',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    flexDirection: 'row',
    height: 60,
    top: 0,
    marginTop: Platform.OS === 'ios' ? 35 : 0,
  },
  searchbar: {
    height: 40,
    width: '70%',
    borderRadius: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  postcard: {
    backgroundColor: '#fff',
    width: width,
    height: hight / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderColor: '#f0f8ff',
  },

  Sellingviewpostcard: {
    backgroundColor: '#fff',
    width: width,
    height: hight / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderColor: '#f0f8ff',
  },
  image: {
    width: width,
    height: hight / 2.5,
  },
  surveyImage: {
    width: width / 1.25,
    height: hight / 2.9,
  },
  HomeTopIcons: {
    width: 85,
    height: 85,
    borderRadius: 25,
  },
  arrow: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailsIcons: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posticon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  posticonCommentLikes: {
    flex: 0.1,
    backgroundColor: '#D2691Eff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: hight / 20,
    flexDirection: 'row',
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  posticonCommentLikesSection: {
    flex: 0.1,
    width: width,
    height: hight / 25,
    flexDirection: 'row',
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    position: 'absolute',
    marginTop: 50,
  },
  btnHome: {
    height: hight / 23,
    width: width / 5.5,
    borderRadius: 20,
    backgroundColor: '#D2691Eff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnHome2: {
    width: width / 3,
    height: 55,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidsButton: {
    height: hight / 23,
    width: width / 2.5,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidsButtonAccept: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
    borderWidth: 2,
    borderColor: '#D2691Eff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  bidsButtonAcceptGray: {
    marginLeft: 5,
    height: hight / 23,
    width: 100,
    borderRadius: 20,
    backgroundColor: '#D2691Eff',
    borderWidth: 2,
    borderColor: '#f3f3f3',
    alignItems: 'center',
    // justifyContent: 'center',
  },

  homeimg: {
    backgroundColor: '#ffffff',
    width: width,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  homesec: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: 60,
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 5,
  },

  topImages: {
    width: 100,
    height: 100,
    borderRadius: 25,
    // borderWidth: 1,
    // borderColor: '#ffffff',
    // backgroundColor: '#ffffff'
  },
  BeautyOfComp: {
    backgroundColor: '#dcdcdc',
    marginTop: 15,
    marginBottom: 15,
    height: 170,
    borderRadius: 10,
    width: width - 20,
  },
  OpacityAddnewFirstBlock: {
    backgroundColor: '#FFFFFF',

    marginTop: 0,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,

    padding: 30,
    borderRadius: 10,
  },
  BeautyOpacity: {
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  OpacityAddnew: {
    backgroundColor: '#fff',
    marginRight: 10,
    padding: 8,
    paddingHorizontal: 20,
    // paddingRight: 5,
    borderRadius: 10,
  },
  imageAdnew: {
    width: 120,
    height: 120,
  },
  topImageshome: {
    width: 80,
    height: 80,
    margin: 7,
    // borderWidth: 1,
    // borderColor: '#ffffff',
    // backgroundColor: '#ffffff'
  },
  //CSS ADD NEW
  containerBeauty: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    width: width,
    // marginTop: Platform.OS === 'android' ? 50 : 0,
  },
  BeautyImages: {
    width: 160,
    height: 136,
    borderRadius: 10,
    padding: 10,
    // borderWidth: 1,
    // borderColor: '#ffffff',
    // backgroundColor: '#ffffff'
  },
  ButtonBeauty: {
    padding: 10,
    backgroundColor: '#D2691Eff',
    marginLeft: 5,
    borderRadius: 10,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 0.5,
  },

  containerAddNew: {
    flex: 1,
    backgroundColor: '#7E7E7E',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    marginTop: Platform.OS === 'android' ? 0 : 0,
  },
  BeatyCard: {
    backgroundColor: '#fff',
    width: width,
    height: hight / 1.5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardaddew: {
    backgroundColor: '#7E7E7E',
    width: width,
    height: hight / 1.5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beautyimg: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    gap: 25,
  },
  viewimg: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    gap: 5,
  },
  //Forms
  RadioInput: {
    height: 40,
    padding: 10,
    width: width - '30%',
    borderColor: '#d2691e',
    borderWidth: 1,
    marginTop: 15,
    textAlign: 'right',

    borderRadius: 6,
  },
  forminputs: {
    height: 40,
    padding: 10,
    width: width - 50,
    borderColor: '#d2691e',
    borderWidth: 1,
    marginTop: 15,
    textAlign: 'right',
    borderRadius: 20,
    color: 'black',
  },
  forminputsPrice: {
    height: 40,
    padding: 10,
    width: width - 160,
    borderColor: '#d2691e',
    borderWidth: 1,
    marginTop: 15,
    textAlign: 'right',
    borderRadius: 6,
    color: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#DCDCDC',
    opacity: 0.9,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent:'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    width: width - 100,
  },
  textHeadingg: {
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 16,
    padding: 5,
    marginTop: 2,
    right: 0,
    color: 'black',
  },
  forminputsDetails: {
    padding: 10,
    height: 40,
    width: width - 50,
    borderColor: '#d2691e',
    borderWidth: 1,
    textAlign: 'right',
    borderRadius: 6,
    color: 'black',
    // marginRight: 10,
    // textColor: "#000000"
  },
  containerProfile: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    marginTop: Platform.OS === 'android' ? 15 : 0,
  },
  containerBids: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    // justifyContent: 'center',
    width: width,
    marginTop: Platform.OS === 'android' ? 15 : 0,
  },

  forminputsPicker: {
    height: 40,
    width: width / 1.5,
    borderColor: '#d2691e',
    borderWidth: 2,
    marginTop: 8,
    textAlign: 'right',
    borderRadius: 6,
    marginLeft: width / 3,
  },
  inputsdecrp: {
    paddingBottom: 15,
    width: width - 80,
    height: 150,
    borderColor: '#d2691e',
    borderWidth: 1,
    textAlign: 'right',
    borderRadius: 6,
    margin: 6,
    color: 'black',
  },
  inputdecrp: {
    padding: 10,
    width: width - 50,
    height: 150,
    borderColor: '#d2691e',
    borderWidth: 1,
    marginTop: 15,
    textAlign: 'right',
    borderRadius: 6,
    color: 'black',
  },
  fontDetails: {
    fontSize: 10,
    color: 'black',
  },
  btnform: {
    height: hight / 20,
    width: width / 4,
    borderRadius: 20,
    backgroundColor: '#D2691Eff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    alignSelf: 'center',
  },
  mforminputs: {
    height: 40,
    width: width / 2.5,
    borderColor: '#d2691e',
    borderWidth: 1,
    marginTop: 8,
    textAlign: 'right',
    borderRadius: 6,
    margin: 5,
    color: 'black',
    padding: 10,
  },
  cardsignup: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 7},
    shadowOpacity: 0.27,
    shadowRadius: 25,
    backgroundColor: 'white',
    width: width - 30,
    height: hight / 2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputs_signup: {
    height: hight / 5,
    width: width - 80,
    borderColor: '#d2691e',
    borderWidth: 1,
    marginTop: 20,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    textAlign: 'right',
  },
  pricetag: {
    width: 60,
    height: 70,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#D2691Eff',
    top: 0,
    left: 20,
    bottom: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  //Style Msg
  headermsg: {
    marginTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: hight / 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  msgcard: {
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    // alignItems: 'center',
    // justifyContent: 'center',
    // alignContent: 'center',
    height: hight / 1.5,
    right: 10,
  },
  text_recv: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    margin: 10,
    marginRight: 130,
  },
  text_send: {
    backgroundColor: '#d2691e',
    padding: 10,
    width: 200,
    left: width - 220,

    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    margin: 10,
    // marginRight: 10,
  },
  text_send_right: {
    backgroundColor: '#bbb',
    padding: 10,
    width: 200,
    left: 0,

    borderBottomLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    margin: 10,
    // marginRight: 10,
  },
  msgbar: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: width,
    height: 50,
    flexDirection: 'row',
  },
  msginput: {
    height: 40,
    width: width - 60,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'grey',
    textAlign: 'right',
    paddingRight: 10,
    marginLeft: 50,
    marginRight: 10,
    color: 'black',
  },
  sendbtn: {
    padding: 14,
    width: width / 3,
    borderRadius: 10,
    backgroundColor: '#D2691E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgetinputs: {
    height: 40,
    width: width - 100,
    borderColor: '#d2691e',
    borderWidth: 1,
    margin: 8,
    textAlign: 'right',
  },
  textinfo: {
    backgroundColor: '#d2691e',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    flexDirection: 'row',
    borderBottomLeftRadius: 40,
    // borderBottomRightRadius:100,
    // borderBottomEndRadius:100,
    borderBottomRightRadius: 40,
    textAlign: 'center',
  },
  // Style Notofication

  winnerBeauty: {
    top: 0,
    backgroundColor: '#ffebcd',
    position: 'absolute',
    width: width / 1.1,
    height: hight / 10,

    borderRadius: 10,
  },
  winners5: {
    width: width / 1.2,
    backgroundColor: '#f0f8ff',
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 60,
    paddingLeft: 60,
    borderRadius: 10,
    top: 10,
    marginTop: 340,
  },
  winners4: {
    width: width / 1.2,
    backgroundColor: '#f0f8ff',
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 60,
    paddingLeft: 60,
    borderRadius: 10,
    top: 10,
    marginTop: 260,
  },
  winners3: {
    width: width / 1.2,
    backgroundColor: '#f0f8ff',
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 60,
    paddingLeft: 60,
    borderRadius: 10,
    top: 10,
    marginTop: 180,
  },
  winners2: {
    width: width / 1.2,
    backgroundColor: '#f0f8ff',
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 60,
    paddingLeft: 60,
    borderRadius: 10,
    top: 10,
    marginTop: 100,
  },
  winners: {
    width: width / 1.2,
    backgroundColor: '#f0f8ff',
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 60,
    paddingLeft: 60,
    borderRadius: 10,
    top: 10,
    marginTop: 20,
  },
  notification: {
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: hight / 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  newsbox: {
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: hight / 5,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  //Style whatsappShare Screen

  aboutUsTouchableOpacity: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quesmark: {
    height: 50,
    width: width / 1.5,
    backgroundColor: '#8b4513',
    justifyContent: 'center',
    margin: 3,
  },
  hand: {
    height: 50,
    width: width / 1.5,
    backgroundColor: '#deb887',
    justifyContent: 'center',
    margin: 3,
  },
  warning: {
    height: 50,
    width: width / 1.5,
    justifyContent: 'center',
    margin: 3,
    backgroundColor: '#a9a9a9',
  },
  bank: {
    height: 50,
    width: width / 1.5,
    justifyContent: 'center',
    margin: 3,
    backgroundColor: '#0000cd',
  },
  whtsapp: {
    height: hight / 15,
    width: width / 1.5,
    backgroundColor: '#00ff00',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 3,
  },
  iconbox: {
    width: 50,
    height: 43,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'absolute',
    right: 0,
  },
  boxtext: {
    fontWeight: '400',
    fontSize: 16,
    color: '#fff',
    marginRight: 10,
  },
  sharebtn: {
    width: 43,
    height: 43,
    borderRadius: 20,
    backgroundColor: '#d2691e',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  bottomimg: {
    width: width,
    height: hight / 4.8,
    bottom: 0,
    position: 'absolute',
  },
  Beautycard: {
    backgroundColor: '#f0f8ff',
    width: width / 2,
    height: hight / 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  likeicon: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 2,
    height: hight / 40,
    flexDirection: 'row',
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  top: {
    // top: 0,
    // left: 0,
    // right: 0,
    // position: 'absolute',
    backgroundColor: '#ffffff',
    width: width,

    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  topbtn: {
    height: hight / 23,
    width: width / 3.5,
    borderRadius: 7,
    backgroundColor: '#D2691Eff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  topbtnn: {
    height: hight / 23,
    width: width / 3.5,
    borderRadius: 7,
    backgroundColor: '#faf0e6',
    borderColor: '#D2691Eff',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
  underTop: {
    // top:50,
    // left: 20,
    // right: 0,
    // position: 'absolute',
    backgroundColor: '#f0f8ff',
    width: width - 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'center',
    padding: 5,
  },
  bottombtnn: {
    height: hight / 23,
    width: width - 50,
    borderRadius: 7,
    backgroundColor: '#faf0e6',
    borderColor: '#D2691Eff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  underTopview: {
    backgroundColor: '#faf0e6',
    width: width / 4,
    height: hight / 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 10,
  },
  //Winner page style
  winnerList: {
    backgroundColor: '#faf0e6',
    width: width - 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderColor: '#faf0e6',
    marginTop: 30,
  },
  winnerinfo: {
    backgroundColor: '#fff',
    width: width - 20,
    height: hight / 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 10,
    flexDirection: 'row',
  },
  imagecircle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    right: 30,
    position: 'absolute',
  },
  ratingline: {
    backgroundColor: '#D2691Eff',
    width: width - 150,
    height: hight / 190,
    marginRight: 120,
    marginTop: 5,
  },
  inputNews: {
    height: 40,
    width: width - 80,
    borderColor: '#d2691e',
    borderBottomWidth: 1,
    textAlign: 'right',
    color: 'black',
  },
  paragraph: {
    width: width - 140,
    margin: 24,
    fontSize: 14,
    // padding: 1,
    textAlign: 'right',
    // alignItems:  "5",
    //  'flex-start' : 'center'
  },

  paragraph2: {
    width: width - 140,
    margin: 24,
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'right',
    color: 'black',
    // alignItems:  "5",
    //  'flex-start' : 'center'
  },
  imageNews: {
    width: width - 245,
    height: 155,
    borderRadius: 10,
    marginRight: -10,
  },
  profileimagecircle: {
    width: 50,
    height: 50,
    borderRadius: 20,
    right: 50,
    position: 'absolute',
  },

  newsbox1: {
    // flex:1, //used in news screen
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row', //remved for news screen
    width: width - 20,
    height: 160,
    alignSelf: 'center',
    marginBottom: 10,
    elevation: 5,
    borderRadius: 15,
  },
  Questioncard: {
    backgroundColor: '#fff',
    width: width - 40,
    height: hight / 1.8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#f0f8ff',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 7},
    shadowOpacity: 0.27,
    shadowRadius: 25,
    margin: 15,
    borderStyle: 'solid',
    borderColor: '#d2691e',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 15,
  },
  profileQuestioncard: {
    backgroundColor: '#fff',
    width: width - 40,
    borderColor: '#d2691e',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingBottom: 15,
    marginBottom: 10,
  },
  newsQuestioncard: {
    backgroundColor: '#fff',
    width: width - 40,
    height: hight / 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#f0f8ff',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 7},
    shadowOpacity: 0.27,
    shadowRadius: 25,
    margin: 15,
    borderStyle: 'solid',
    borderColor: '#d2691e',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 15,
  },

  surveyQuestioncard: {
    backgroundColor: '#fff',
    width: width - 40,
    height: hight / 1.75,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#f0f8ff',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 7},
    shadowOpacity: 0.27,
    shadowRadius: 25,
    margin: 15,
    borderStyle: 'solid',
    borderColor: '#d2691e',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 15,
  },
  ansinput: {
    height: 40,
    width: '70%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d2691e',
    padding: 5,
  },
  questions: {
    margin: 10,
    fontSize: 16,
    textAlign: 'right',
    marginRight: 50,
    fontWeight: 'bold',
    color: 'black',
  },
  radiotxt: {
    marginTop: 7,
  },
  breakLine: {
    width: 320,
    height: 0,
    borderColor: '#909090',
    borderWidth: 0.5,
    opacity: 0.3,
    marginTop: 10,
  },
  //style news
  profilebar: {
    flex: 0.2,
    bottom: 130,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: '#d2691e',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: hight / 15,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  headerProfile: {
    width: width,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    top: Platform.OS === 'android' ? 0 : 0,
  },
  cameraview: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#f7f7ff',
  },
  user_Home: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 5,
    borderWidth: 2,
    right: 10,
    position: 'absolute',
    marginBottom: 10,
    borderColor: 'grey',
    marginTop: 10,
  },

  user_HomeComment: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 5,
    borderWidth: 2,
    right: 10,
    top: 5,
    position: 'absolute',
    marginBottom: 10,
    borderColor: 'grey',
  },

  user_HomeMessageModal: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 2,
    right: 30,

    position: 'absolute',
    marginBottom: 10,
    borderColor: 'grey',
  },
  user_HomeMessage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 2,
    right: 10,
    position: 'absolute',
    marginBottom: 10,
    borderColor: 'grey',
  },
  bidsItem: {
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    right: 10,
    position: 'absolute',
    borderColor: 'grey',
  },
  sponsorItem: {
    width: width - 30,
    borderRadius: 20,
    // backgroundColor: '#fff',
    //  backgroundColor: '#f3f3f3',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  user_detail: {
    width: 170,
    backgroundColor: '#ff',
    // justifyContent: 'center',
    alignItems: 'center',
    right: 60,
    position: 'absolute',
  },
  comments: {
    // width: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginright: 5,
    // position: 'absolute',
    top: 10,
  },
  commentsName: {
    // width: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    right: 50,
    position: 'absolute',
    marginTop: 3,
  },
  error: {
    color: 'red',
    marginRight: 200,
  },
});
