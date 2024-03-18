/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import 'react-native-gesture-handler';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Styles} from '../styles/globlestyle';
import * as userActions from '../redux/actions/user_actions';
import BackBtnHeader from '../components/headerWithBackBtn';
import * as ArabicText from '../language/EnglishToArabic';
import {family} from '../constants/Family';
class AddNew extends Component {
  render() {
    const onAddButtonClick = screen => {
      let {user} = this.props;
      if (user?.user?.status == true) {
        this.props.navigation.navigate(screen);
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    return (
      <View style={[Styles.containerAddNew, {justifyContent: 'flex-start'}]}>
        <BackBtnHeader />
        <View style={[Styles.OpacityAddnewFirstBlock, {marginTop: 15}]}>
          <Text style={styles.headings}>
            {ArabicText?.Pledge}
            {'\n'}
          </Text>
          <Text style={styles.subHeading}>
            {ArabicText?.Andfulfillyourcovenant}
            {'\n'}
          </Text>

          <Text
            style={{
              fontSize: 14,
              textAlign: 'right',
              color: 'black',
              fontFamily: family.Neo_Regular,
            }}>
            تعهد ان جميع المعلومات التي سوف اذكرها - صحيحة ومطابقة لحالة السلعة
            الحالية اتعهد بفحص السلعة ومعاينتها قبل الشراء من - الغش والعبث
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
          }}>
          <View style={Styles.viewimg}>
            <TouchableOpacity
              onPress={() => onAddButtonClick('CamelClubForm')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/Camel_Club.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onAddButtonClick('TreatingCamelForm')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/ilaj.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>
          </View>
          <View style={Styles.viewimg}>
            <TouchableOpacity
              onPress={() => onAddButtonClick('MissingCamelForm')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/group_840_480.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onAddButtonClick('SellingCamelForm')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/group_838.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>
          </View>
          <View style={Styles.viewimg}>
            <TouchableOpacity
              onPress={() => onAddButtonClick('CamelFood')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/group_844_480.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onAddButtonClick('SellingEqForm')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/group_843_480.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>
          </View>
          <View style={Styles.viewimg}>
            <TouchableOpacity
              onPress={() => onAddButtonClick('CompetitionList')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/group_845_480.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onAddButtonClick('MovingCamelForm')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/Camel_moving.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>
          </View>
          <View style={Styles.viewimg}>
            <TouchableOpacity
              style={Styles.OpacityAddnew}
              onPress={() => onAddButtonClick('LiveMarketingForm')}>
              <Image
                source={require('../../assets/LiveMarketingLogo.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onAddButtonClick('CamelFemaleForm')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/femaleCamel.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>
          </View>
          <View style={Styles.viewimg}>
            <TouchableOpacity
              onPress={() => onAddButtonClick('News')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/news.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>

            <TouchableOpacity
              style={Styles.OpacityAddnew}
              onPress={() => onAddButtonClick('SurveyList')}>
              <Image
                source={require('../../assets/group-survey.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
});
const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddNew);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headings: {
    alignItems: 'center',
    color: 'black',
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: family.Neo_Medium,
  },
  subHeading: {
    alignItems: 'center',
    color: 'black',
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: family.Neo_Medium,
  },
});
