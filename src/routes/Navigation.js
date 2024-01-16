import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../screens/Login.js';
import Signup from '../screens/Signup.js';
import SellingEqForm from '../screens/SellingEquipmentForm.js';
import MissingCamelForm from '../screens/MissingCamelForm.js';
import CamelClubForm from '../screens/CamelClubForm.js';
import MovingCamelForm from '../screens/MovingCamelForm.js';
import Forgetpass from '../screens/ForgetPassword.js';
import Notification from '../screens/Notification.js';
// import Whatsapp from '../screens/Whatsappshare.js';
import AppDetails from '../screens/AppDetails.js';
import Survey from '../screens/Surveyform.js';
import Header from '../components/Header.js';
import SellingCamelForm from '../screens/SellingCamelForm.js';
import Footer from '../components/Footer.js';
import EditProfile from '../screens/EditProfile.js';
import CamelClubDetailsComponent from '../screens/CamelClubDetailsComponent.js';
import CamelClubList from '../screens/CamelClubList.js';
import CamelMarketingList from '../screens/CamelMarketingList.js';
import CamelTreatmentList from '../screens/CamelTreatmentList.js';
import CamelFemaleForm from '../screens/CamelFemaleForm.js';
import BeautyCompetitionForm from '../screens/BeautyCompitationForm.js';
import CompetitionList from '../screens/CompetitionList.js';
import CamelFood from '../screens/CamelFoodForm.js';
import TreatingCamelForm from '../screens/TreatingCamelForm.js';
import LiveMarketingForm from '../screens/LiveMarketingForm.js';
import ViewNews from '../screens/ViewNews.js';
import SurveyList from '../screens/SurveyList.js';
import Comments from '../screens/Comments.js';
import CamelFoodList from '../screens/CamelFoodList.js';
import CamelMissingList from '../screens/CamelMissingList.js';
import CamelMovingList from '../screens/CamelMovingList.js';
import CamelSellingList from '../screens/CamelSellingList.js';
import FemaleList from '../screens/FemaleCamelList.js';
import SellingEquipmentList from '../screens/SellingEqList.js';
import CamelEquipmentList from '../screens/CamelEquipmentList.js';
import DetailsComponentWithPrice from '../screens/DetailsComponentWithPrice.js';
import MessageView from '../screens/chat/MessageView.js';
import OtpSignUp from '../screens/OtpSignUp.js';
import DetailsMissingAndTreatingCamel from '../screens/DetailsMissingAndTreatingCamel.js';
import DetailsSellingCamel from '../screens/DetailsSellingCamel.js';
import DetailsMovingCamel from '../screens/DetailsMovingCamel.js';
import DetailsMarketingCamel from '../screens/DetailsMarketingCamel.js';
import DetailsFemaleCamel from '../screens/DetailsFemaleCamel.js';
import BeautyOfCompetition from '../screens/BeautyOfCompetitionDetail.js';
import WinnerBeauty from '../screens/WinnerBeauty.js';
import AboutUs from '../screens/AboutUs.js';

import PrivacyPolicy from '../components/PrivacyPolicy.js';
import Bank from '../screens/Bank.js';
import BidPost from '../screens/Bids/BidsDoneByMe.js';
import BidsOnPost from '../screens/Bids/BidsOnMyPost.js';
import OtpForgetPassword from '../screens/OtpForgetPassword.js';
import News from '../screens/NewsList.js';
import BidTab from '../screens/Bids/BidTab.js';
import ChatTopTab from '../screens/chat/ChatTopTab.js';
import Groups from '../screens/chat/Groups.js';
import FriendList from '../screens/chat/FriendList.js';
import GroupChat from '../screens/chat/GroupChat.js';
import CreateGroup from '../screens/chat/CreateGroup.js';
import UserProfile from '../screens/UserProfile.js';
import detailCompetition from '../screens/CompetitionPostDetails.js';
import ChangePassword from '../screens/ChangePassword.js';
import FollowingList from '../screens/FollowingList.js';
import FollowersList from '../screens/FollowersList.js';
import MyFriendList from '../screens/MyFriendList.js';
import CreateProfile from '../screens/CreateProfile.js';
import BackBtnHeader from '../components/headerWithBackBtn.js';
import Sponser from '../screens/SponcersList.js';
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
          options={{header: () => <BackBtnHeader />}}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{header: () => <BackBtnHeader />}}
        />
        <Stack.Screen
          name="OtpSignUp"
          component={OtpSignUp}
          options={{header: () => <BackBtnHeader />}}
        />
        <Stack.Screen
          name="Forgetpass"
          component={Forgetpass}
          options={{header: () => <BackBtnHeader />}}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{header: () => <BackBtnHeader />}}
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
          name="CamelFemaleForm"
          component={CamelFemaleForm}
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
          name="TreatingCamelForm"
          component={TreatingCamelForm}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
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
          name="CamelClubForm"
          component={CamelClubForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MovingCamelForm"
          component={MovingCamelForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Comments"
          component={Comments}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Footer}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="Notification"
          component={Notification}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="AppDetails"
          component={AppDetails}
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
          name="SellingCamelForm"
          component={SellingCamelForm}
          options={{headerShown: false}}
          // options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CompetitionPostDetail"
          component={detailCompetition}
          options={{headerShown: false}}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ChatTopTab"
          component={ChatTopTab}
        />
        <Stack.Screen name="Groups" component={Groups} />
        <Stack.Screen name="FriendList" component={FriendList} />
        <Stack.Screen
          name="GroupChat"
          component={GroupChat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="CreateGroup"
          component={CreateGroup}
        />
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
        <Stack.Screen
          name="Sponcers"
          component={Sponser}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
