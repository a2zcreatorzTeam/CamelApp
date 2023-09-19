import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {Styles} from '../styles/globlestyle';
// import {CheckBox} from "@react-native-community/checkbox"
import {RadioButton} from 'react-native-paper';
import * as ArabicText from '../language/EnglishToArabic';
import {DataContext} from '../context/DataContext';
import {Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

class Surveyform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: props?.route?.params?.surveyId,
      end_date_status: this.props?.route?.params.surveyId?.status ? 1 : 0,
      arrayAnswers: props?.route?.params?.arrayAnswers?.answers,
      status: props?.route?.params?.status,
      showPercents: false,
      selectedAnswer: [],
      checked: 'first',
      register: false,
      arrayForSubmit: [],
    };
  }

  submitSurvey = item => {
    console.log(this.state.survey.survey_details);
    let {user} = this.props;
    user = user?.user?.user;
    // console.log('user', user);
    // console.log('this.state.arrayForSubmit', this.state.arrayForSubmit);
    const data = {
      user_id: user?.id,
      survey_answers: this?.state?.arrayForSubmit,
    };

    if (user != undefined) {
      if (this?.state?.arrayForSubmit?.length !== 0) {
        camelapp
          .post(
            '/add/survey',
            {data: data},
            // user_id: user?.id,
            // survey_answers: this.state.arrayForSubmit,
          )
          .then(res => {
            console.log('response59', res?.data?.message);
            if (res?.data?.message === 'Already Submitted') {
              alert('You have already submitted survey');
            } else {
              if (res?.data) {
                alert('تم إرسال الاستبيان بنجاح');
                this.props.navigation.pop();
                // this.props.navigation.navigate('SurveyList');
              }
            }
          })
          .catch(err => {
            console.log(err, 'ererrererer');
          });
      } else {
        alert('يرجى تحديد الخيارات');
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  selectedAnswer(item, i, index) {
    let {user} = this.props;
    user = user?.user?.user;
    let survey = this?.props?.route?.params?.surveyId;
    for (let j = 0; j < survey?.survey_details[index]['answer'].length; j++) {
      survey.survey_details[index]['answer'][j]['flag'] = false;
      survey.survey_details[index]['answer'][j]['flagForCount'] = true;
    }
    survey.survey_details[index]['answer'][i]['flag'] = true;
    survey.survey_details[index]['answer'][i]['flagForCount'] = false;
    this.setState({selectedAnswer: survey.survey_details[index]});
    let tempsubmitArray = this.state.arrayForSubmit;
    console.log(tempsubmitArray, 'tempsubmitArraytempsubmitArray');
    let tempObj = {
      survey_detail_id: survey?.survey_details[index]?.survey_detail_id,
      answer: survey?.survey_details[index]['answer'][i]['answer'],
      survey_id: survey?.survey_details[index].survey_id,
    };
    if (tempsubmitArray?.length > 0) {
      tempsubmitArray = tempsubmitArray?.filter(person => {
        return (
          person?.survey_detail_id !==
          survey?.survey_details[index]?.survey_detail_id
        );
      });
    }
    tempsubmitArray.push(tempObj);
    this.setState({arrayForSubmit: tempsubmitArray});
  }
  render() {
    console.log(
      this?.state?.end_date_status,
      this?.state?.status,
      this?.state?.end_date_status,
      this?.state?.status,
    );
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#d2691e',
            fontFamily: 'centaur',
            marginBottom: 5,
            marginRight: 50,
          }}>
          Take a Survey
        </Text>

        {!this.state.status && (
          <View style={{width: width, height: hight / 1.5}}>
            <FlatList
              horizontal={false}
              key={item => item?.survey_details?.answer}
              data={this.state?.survey.survey_details}
              contentContainerStyle={{
                width: '100%',
                paddingBottom: '20%',
              }}
              renderItem={({item, index}) => (
                <View
                  style={{
                    marginTop: 10,
                    alignItems: 'center',
                    width: width - 100,
                    marginBottom: 10,
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10,
                        marginRight: 20,
                      }}>
                      {item?.question}
                    </Text>

                    <View
                      style={{
                        borderRadius: 30,
                        backgroundColor: 'black',
                        overflow: 'hidden',
                      }}>
                      <Image
                        source={{
                          uri:
                            'http://www.tasdeertech.com/images/survey/' +
                            item.image,
                        }}
                        style={{
                          width: width - 100,
                          height: 200,
                          backgroundColor: 'black',
                        }}></Image>
                    </View>
                  </View>

                  <View style={{width: '100%'}}>
                    {item?.answer?.map((val, i) => {
                      return (
                        <TouchableOpacity
                          key={String(i)}
                          onPress={() => {
                            this.selectedAnswer(val, i, index);
                            this.setState({showPercents: true});
                          }}
                          style={{
                            backgroundColor:
                              val.flag === true ? '#d2691e' : '#fff',
                            alignItems: 'center',
                            marginTop: 10,
                            width: width - 100,
                            borderRadius: 10,
                            alignSelf: 'flex-end',
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              color: val.flag === true ? '#fff' : 'black',
                              fontSize: 18,
                              marginRight: 10,
                              alignSelf: 'flex-end',
                              padding: 10,
                            }}>
                            {val?.answer}
                          </Text>
                          {/* {val?.flag === true && (
                            <Text
                              style={{
                                color: val.flag === true ? '#fff' : '#d2691e',
                                fontSize: 16,
                                marginRight: 10,
                                marginLeft: 10,
                              }}>
                              {parseFloat(
                                (val?.answer_count + 1) /
                                  (item.total_count + 1),
                              ).toFixed(2) *
                                100 ==
                              NaN
                                ? 0
                                : parseFloat(
                                    (
                                      (val?.answer_count + 1) /
                                      (item.total_count + 1)
                                    ).toFixed(2),
                                  ) * 100}
                              %
                            </Text>
                          )} */}
                          {/* {val?.flagForCount === true && (
                            <Text
                              style={{
                                color: item.flag === false ? '#d2691e' : '#fff',
                                fontSize: 16,
                                marginRight: 10,
                                marginLeft: 10,
                              }}>
                              {parseFloat(
                                (
                                  val?.answer_count /
                                  (item.total_count + 1)
                                ).toFixed(2),
                              ) *
                                100 ==
                              NaN
                                ? 0
                                : parseFloat(
                                    (
                                      val?.answer[i]?.answer_count /
                                      (item.total_count + 1)
                                    ).toFixed(2),
                                  ) * 100}
                              %
                            </Text>
                          )} */}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {this.state.status && (
          <View style={{width: width}}>
            <FlatList
              horizontal={false}
              key={item => item?.survey_details?.id}
              data={this?.state?.survey?.survey_details}
              contentContainerStyle={{
                width: '100%',
                paddingBottom: '20%',
              }}
              renderItem={({item, index}) => (
                <View
                  style={{
                    marginTop: 10,
                    alignItems: 'center',
                    width: width - 100,
                    marginBottom: 10,
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      // flexDirection: "row",
                      width: '100%',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10,
                        marginRight: 20,
                      }}>
                      {item?.question}
                    </Text>

                    <View
                      style={{
                        borderRadius: 30,
                        backgroundColor: 'black',
                        overflow: 'hidden',
                      }}>
                      <Image
                        source={{
                          uri:
                            'http://www.tasdeertech.com/images/survey/' +
                            item?.image,
                        }}
                        style={{
                          width: width - 100,
                          height: 200,
                          backgroundColor: 'black',
                        }}></Image>
                    </View>
                  </View>

                  <View style={{width: '100%'}}>
                    {item?.answer?.map((val, i) => {
                      console.log(val, 'valueeee');
                      var percentage =
                        parseFloat(
                          (val?.answer_count / item?.total_count).toFixed(2),
                        ) * 100;

                      return (
                        <View
                          style={{
                            backgroundColor:
                              val?.flag === true ? '#d2691e' : '#fff',
                            alignItems: 'center',
                            marginTop: 10,
                            width: width - 100,
                            borderRadius: 10,
                            alignSelf: 'flex-end',
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              color: val?.flag === true ? '#fff' : 'black',
                              fontSize: 18,
                              marginRight: 10,
                              alignSelf: 'flex-end',
                              padding: 10,
                            }}>
                            {val.answer}
                          </Text>
                          <Text
                            style={{
                              color: val.flag === true ? '#fff' : '#d2691e',
                              fontSize: 16,
                              marginRight: 10,
                              marginLeft: 10,
                            }}>
                            {isNaN(percentage) ? 0 : percentage}%
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {this?.state?.status ? null : this?.state?.end_date_status == 1 &&
          this?.state?.status == true ? null : this?.state?.end_date_status ==
            0 && this?.state?.status == false ? (
          <TouchableOpacity
            style={[Styles.btn, {position: 'absolute', bottom: 10}]}
            onPress={() => this.submitSurvey()}>
            <Text style={Styles.textbtn}>{ArabicText.submit_survey}</Text>
          </TouchableOpacity>
        ) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(Surveyform);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
