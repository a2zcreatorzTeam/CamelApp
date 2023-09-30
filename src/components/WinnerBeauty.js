import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {ProgressBar} from 'react-native-paper';
class WinnerBeauty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winnerList: props.route.params.competitionItem,
      competitionItem: props.route.params.competitionItem,
    };
    console.log('this.state.winnerList', this.state.winnerList);
  }

  render() {
    return (
      <View style={Styles.container}>
        {this.state.winnerList.map((el, i) => (
          <View style={[Styles.WinnerIcon, {marginBottom: 20}]}>
            <View style={Styles.winnerBeauty}>
              <ProgressBar
                key={i}
                progress={el?.like_count}
                color="#d2691e"
                style={{
                  height: 4,
                  width: 220,
                  marginTop: 40,
                  position: 'absolute',
                  marginLeft: 25,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  right: 10,
                  alignItems: 'center',
                  top: 5,
                }}>
                <Image
                  key={el.id}
                  source={{
                    uri:
                      'http://www.tasdeertech.com/public/images/profiles/' +
                      el?.user_image,
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 50,
                  }}
                  resizeMode="cover"></Image>
              </View>
              <Text
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 100,
                  color: '#D2691E',
                }}>
                {el.user_name}
              </Text>
              <Text
                style={{
                  position: 'absolute',
                  left: 15,
                  top: 10,
                  color: '#D2691E',
                }}>
                {el.like_count}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }
}
export default WinnerBeauty;
