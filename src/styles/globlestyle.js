import {StyleSheet, Platform, StatusBar} from 'react-native';
import {Dimensions} from 'react-native';
import {family} from '../constants/Family';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: width,
  },
  headingPostText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2691Eff',
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  imageCarousal: {
    width: width,
    height: hight / 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
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
  containerSellingCamel: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
  },
  containerNews: {
    flex: 1,
    // backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
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
    paddingTop: 50,
    width: width,
    alignItems: 'center',
  },
  containerDetails: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: width,
    paddingBottom: width * 0.2,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#d2691e',
    alignSelf: 'center',
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  inputs: {
    height: 40,
    width: width - 80,
    borderBottomColor: '#d2691e',
    borderBottomWidth: 1,
    textAlign: 'right',
    color: 'black',
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  card: {
    // shadowColor: 'black',
    // shadowOffset: { width: 0, height: 7 },
    // shadowOpacity: 0.27,
    // shadowRadius: 25,
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
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  header: {
    backgroundColor: '#d2691e',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    paddingTop: Platform.OS == 'ios' ? 20 : 15,
  },
  subHeaderView: {
    flexDirection: 'row',
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
  image: {
    width: width,
    height: hight / 2.5,
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
  bidsButtonAccept: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
    borderWidth: 2,
    borderColor: '#D2691Eff',
    alignItems: 'center',
    marginVertical: 5,
    // justifyContent: 'center',
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
    margin: 10,
    marginTop: 0,
    padding: 30,
    borderRadius: 10,
  },
  OpacityAddnew: {
    backgroundColor: '#fff',
    marginRight: 10,
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  //CSS ADD NEW
  containerBeauty: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: width,
  },
  BeautyImages: {
    width: 160,
    height: 136,
    borderRadius: 10,
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
    color: '#fff',
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  containerAddNew: {
    flex: 1,
    backgroundColor: '#7E7E7E',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    marginTop: Platform.OS === 'android' ? 0 : 0,
  },
  viewimg: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    gap: 5,
  },
  //Forms
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
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
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
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
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
    justifyContent: 'center',
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
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
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
  },
  containerProfile: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    marginTop: Platform.OS === 'android' ? 20 : 50,
  },
  containerBids: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: width,
    marginTop: Platform.OS === 'android' ? 15 : 0,
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
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  fontDetails: {
    fontSize: 10,
    color: 'black',
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
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
    marginTop: 20,
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
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.27,
    shadowRadius: 25,
    backgroundColor: 'white',
    width: width - 30,
    height: hight / 2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
  text_send: {
    backgroundColor: '#d2691e',
    padding: 10,
    width: 250,
    left: width - 270,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    margin: 10,
    elevation: 0,
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
    elevation: 0,
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
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
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
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
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
  inputNews: {
    height: 40,
    width: width - 80,
    borderColor: '#d2691e',
    borderBottomWidth: 1,
    textAlign: 'right',
    color: 'black',
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  imageNews: {
    width: width - 245,
    height: 140,
    borderRadius: 10,
    marginRight: -10,
  },
  newsbox1: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', //remved for news screen
    width: width - 20,
    height: 190,
    alignSelf: 'center',
    marginBottom: 10,
    elevation: 5,
    borderRadius: 15,
    overflow: 'hidden',
    paddingHorizontal: 30,
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
  //style news
  headerProfile: {
    width: width,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // top: Platform.OS === 'android' ? 0 : 0,
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
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 5,
    borderWidth: 2,
    marginBottom: 10,
    borderColor: 'grey',
    justifyContent: 'center',
  },
  sponsorItem: {
    width: width - 30,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  user_detail: {
    width: 170,
    backgroundColor: '#ff',
    alignItems: 'center',
    right: 60,
    position: 'absolute',
  },

  catBtnText: {
    color: '#D2691Eff',
    fontSize: 15,
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Medium,
  },

  // DETAIL SCREENS STYLES
  firstView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    marginTop: 15,
    width: '100%',
  },
  userName: {
    color: '#000',
    fontSize: 18,
    marginRight: 10,
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  userLocation: {
    color: '#000',
    fontSize: 14,
    marginRight: 10,
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  priceTag: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  price: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    fontSize: 13,
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  priceView: {
    backgroundColor: '#D2691Eff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  userDetailView: {
    alignItems: 'flex-end',
    width: '68%',
  },
  imageView: {
    height: 63,
    width: 63,
    borderRadius: 50,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    height: 55,
    width: 55,
    resizeMode: 'center',
    borderRadius: 50,
  },
  socialIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  socialIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  scrollContentContainer: {
    minHeight: '100%',
    paddingBottom: width * 0.1,
    backgroundColor: '#fff',
  },
  textinfo: {
    backgroundColor: '#d2691e',
    width: '100%',
    paddingVertical: 5,
    flexDirection:'row',
    justifyContent:'space-around'
  },
  textView:{
    alignItems: 'center',
    justifyContent:'center'
  },
  viewText:{
    color: '#fff'
  },
  OR:{
    fontSize: 30,
    fontWeight: '400',
    color: '#fff',
  }
});
