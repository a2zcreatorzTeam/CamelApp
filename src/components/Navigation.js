import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import SellingEqForm from '../screens/SellingEquipmentForm.js';
import MissingCamelForm from '../screens/MissingCamelForm.js';
import CamelClub from '../screens/CamelClub';
import MovingCamelForm from '../screens/MovingCamelForm';
import Forgetpass from '../screens/ForgetPassword';
import Notification from '../screens/Notification';
import Whatsapp from '../screens/Whatsappshare';
import BeautyCompetition from '../screens/BeautyCompitation';
import Survey from '../screens/Surveyform';
import Header from './Header';
import SellingCamel from '../screens/SellingCamel';
import Footer from './Footer';
import EditProfile from '../screens/EditProfile';
import CreatePost from '../screens/CreatePost';
import CamelClubDetailsComponent from '../screens/CamelClubDetailsComponent.js';
import CamelClubList from '../screens/CamelClubList.js';
import CamelMarketingList from '../screens/CamelMarketingList.js';
import CamelTreatmentList from '../screens/CamelTreatmentList.js';
import CamelFemale from '../screens/CamelFemale';
import BeautyCompetitionForm from '../screens/BeautyCompitationForm';
import CompetitionList from '../screens/CompetitionList';
import CamelFood from '../screens/CamelFood';
import TreatingCamels from '../screens/TreatingCamels';
import LiveMarketingForm from '../screens/LiveMarketingForm';
import ViewNews from '../screens/ViewNews';
import SurveyList from '../screens/SurveyList';
import Comments from '../screens/Comments';
import CamelFoodList from '../screens/CamelFoodList.js';
import CamelMissingList from '../screens/CamelMissingList.js';
import CamelMovingList from '../screens/CamelMovingList.js';
import CamelSellingList from '../screens/CamelSellingList.js';
import FemaleList from '../screens/FemaleList.js';
import SellingEquipmentList from '../screens/SellingEqView';
import CamelEquipmentList from '../screens/CamelEquipmentList.js';
import DetailsComponent from '../components/DetailsComponent';
import DetailsComponentWithPrice from '../screens/DetailsComponentWithPrice.js';
import MessageView from '../screens/MessageView';
import MessageNew from '../screens/MessageNew';
import OtpSignUp from '../screens/OtpSignUp';
import DetailsMissingAndTreatingCamel from '../screens/DetailsMissingAndTreatingCamel.js';
import DetailsSellingCamel from '../screens/DetailsSellingCamel.js';
import DetailsMovingCamel from '../screens/DetailsMovingCamel.js';
import DetailsMarketingCamel from '../screens/DetailsMarketingCamel';
import DetailsFemaleCamel from '../screens/DetailsFemaleCamel.js';
import Bids from '../screens/Bids';
import BeautyOfCompetition from '../screens/BeautyOfCompetitionDetail.js';
import WinnerBeauty from './WinnerBeauty';
import AboutUs from '../screens/AboutUs.js';
import Sponcers from '../components/Sponcers';
import PrivacyPolicy from '../components/PrivacyPolicy';
import Bank from '../screens/Bank.js';
import BidPost from '../screens/Bids/BidsDoneByMe.js';
import BidsOnPost from '../screens/Bids/BidsOnMyPost.js';
import OtpForgetPassword from '../screens/OtpForgetPassword';
import News from '../screens/News';
import BidTab from '../screens/Bids/BidTab.js';
import ChatTopTab from '../screens/chat/ChatTopTab';
import Groups from '../screens/chat/Groups';
import FriendList from '../screens/chat/FriendList';
import GroupChat from '../screens/chat/GroupChat';
import CreateGroup from '../screens/chat/CreateGroup';
import UserProfile from '../screens/UserProfile';
import detailCompetition from './detailCompetition';
import CreateProfile from '../screens/CreateProfile';
import ChangePassword from '../screens/ChangePassword';
import FollowingList from '../screens/FollowingList.js';
import FollowersList from '../screens/FollowersList.js';
import MyFriendList from '../screens/MyFriendList.js';
const Stack = createNativeStackNavigator();
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Footer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OtpForgetPassword"
          component={OtpForgetPassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OtpSignUp"
          component={OtpSignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Forgetpass"
          component={Forgetpass}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Messages"
          component={Footer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MessageViewScreen"
          component={MessageView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MessageNew"
          component={MessageNew}
          options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="Bids"
          component={Bids}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BidsOnPost"
          component={BidsOnPost}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="newSatck"
          component={NewSatck}
          options={{headerShown: false}}
        /> */}

        <Stack.Screen
          name="BidPost"
          component={BidPost}
          options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="BidTab"
          component={BidTab}
          options={{headerShown: false}}
        />
        {/* LIST COMPONENET */}
        <Stack.Screen
          name="CamelFoodList"
          component={CamelFoodList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FemaleList"
          component={FemaleList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CamelMissingList"
          component={CamelMissingList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CamelClubDetailsComponent"
          component={CamelClubDetailsComponent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailsSellingCamel"
          component={DetailsSellingCamel}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="DetailsMissingAndTreatingCamel"
          component={DetailsMissingAndTreatingCamel}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CamelSellingList"
          component={CamelSellingList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SellingEquipmentList"
          component={SellingEquipmentList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CamelMovingList"
          component={CamelMovingList}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CamelTreatmentList"
          component={CamelTreatmentList}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="DetailsComponent"
          component={DetailsComponent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CamelEquipmentList"
          component={CamelEquipmentList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailsFemaleCamel"
          component={DetailsFemaleCamel}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailsMovingCamel"
          component={DetailsMovingCamel}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailsMarketingCamel"
          component={DetailsMarketingCamel}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailsComponentWithPrice"
          component={DetailsComponentWithPrice}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SellingEqForm"
          component={SellingEqForm}
          // options={{header: () => <Header />}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          // component={Footer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CamelFemale"
          component={CamelFemale}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="CompetitionList"
          component={CompetitionList}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="CamelFood"
          component={CamelFood}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="SurveyList"
          component={SurveyList}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="CamelClubList"
          component={CamelClubList}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TreatingCamel"
          component={TreatingCamels}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="MissingCamelForm"
          component={MissingCamelForm}
          // options={{header: () => <Header />}}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ViewNews"
          component={ViewNews}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CamelClub"
          component={CamelClub}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="MovingCamelForm"
          component={MovingCamelForm}
          // options={{header: () => <Header />}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Comments"
          component={Comments}
          // options={{ header: () => <Header />
          // }}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Footer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Whatsapp"
          component={Whatsapp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BeautyCompetition"
          component={BeautyCompetition}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BeautyCompetitionForm"
          component={BeautyCompetitionForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BeautyOfCompetition"
          component={BeautyOfCompetition}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WinnerBeauty"
          component={WinnerBeauty}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="Sponcers"
          component={Sponcers}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Bank"
          component={Bank}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="News"
          component={News}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="Survey"
          component={Survey}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LiveMarketingForm"
          component={LiveMarketingForm}
          // options={{header: () => <Header />}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CamelMarketingList"
          component={CamelMarketingList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SellingCamel"
          component={SellingCamel}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CompetitionDetail"
          component={detailCompetition}
          options={{headerShown: false}}
        />
        <Stack.Screen name="ChatTopTab" component={ChatTopTab} />
        <Stack.Screen name="Groups" component={Groups} />
        <Stack.Screen name="FriendList" component={FriendList} />
        <Stack.Screen
          name="GroupChat"
          component={GroupChat}
          options={{headerShown: false}}
        />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FollowingList"
          component={FollowingList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FollowersList"
          component={FollowersList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyFriendList"
          component={MyFriendList}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
