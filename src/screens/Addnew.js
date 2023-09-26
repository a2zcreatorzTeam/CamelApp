import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import 'react-native-gesture-handler';
import {Styles} from '../styles/globlestyle';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import BackBtnHeader from '../components/headerWithBackBtn';
const {width} = Dimensions.get('screen');
class AddNew extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const onAddButtonClick = screen => {
      let {user} = this.props;
      if (user.user.status == true) {
        this.props.navigation.navigate(screen);
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    return (
      <View style={[Styles.containerAddNew, {justifyContent: 'flex-start'}]}>
        <BackBtnHeader />
        <View style={[Styles.OpacityAddnewFirstBlock, {marginTop: 15}]}>
          <Text
            style={{
              alignItems: 'center',
              color: 'black',
              fontSize: 18,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            تـعـهــد
            {'\n'}
          </Text>
          <Text
            style={{
              alignItems: 'center',
              color: 'black',
              fontSize: 16,
              fontWeight: 'bold',
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            ( وأوفوا بعهد الله إذا عاهدتم ولا تنقضوا الأيمان بعد توكيدها ){'\n'}
          </Text>

          <Text style={{fontSize: 14, textAlign: 'right', color: 'black'}}>
            - أتعهد ان جميع المعلومات التي سوف اذكرها . صحيحة ومطابقة لحالة
            السلعة الحالية
            {'\n'} - أتعهد بأتباع شروط التطبيق اضغط هنا
          </Text>
        </View>
        {/* <View style={Styles.cardaddew}> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
          }}>
          <View style={Styles.viewimg}>
            <TouchableOpacity
              onPress={() => onAddButtonClick('CamelClub')}
              style={Styles.OpacityAddnew}>
              <Image
                source={require('../../assets/group_839_480.png')}
                style={Styles.topImages}
                resizeMode="cover"></Image>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onAddButtonClick('TreatingCamel')}
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
              onPress={() => onAddButtonClick('SellingCamel')}
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
                source={require('../../assets/group_842_480.png')}
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
              onPress={() => onAddButtonClick('CamelFemale')}
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
        {/* </View> */}
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
});
