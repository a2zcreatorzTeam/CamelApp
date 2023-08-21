import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native'

const width = Dimensions.get('screen').width
import React, { Component } from 'react'
let Period = [{
    id: 1,
    name: "1200 Calories"
}, {
    id: 2,
    name: "1500 Calories"
},
];

export default class dropdownCamel extends Component {
    constructor(props) {

        super(props);


        this.state = {
            barColor: false,
            selectedItem: '',

            open: false,
            showloader: false
        }


    }
    onSelectedItem(val) {
        this.setState({ showOption: false })
        this.setState({ selectedItem: val })

        //console.log(val)
    }
    render() {
        return (
            <View style={{
                flex: 1, justifyContent: "center",
                alignItems: "center"
            }}>

                <View style={{ alignItems: "center", }}>

                    <View style={{
                        width: '45%',
                        height: 20,
                        backgroundColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: "flex-end",
                        marginBottom: -9,
                        zIndex: 10,
                        marginRight: 20,

                    }}>
                        <View style={{
                            width: "100%",
                            height: 12,
                            backgroundColor: "#fff",
                            marginTop: -3

                        }}>
                        </View>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: this.state.showOption == true ? '#007aff' : "#737272",
                            marginRight: 5,
                            // marginLeft: this.props.language.language == 'arabic' ?0: 5,
                            marginTop: -10,
                            zIndex: 30

                        }}>Period</Text>
                    </View>

                    {/** dropDown */}
                    <TouchableOpacity style={[styles.dropDownstyle,
                    {
                        //  position:"absolute",

                        flexDirection: "row-reverse",
                        //marginLeft: 20,
                        borderColor: this.state.showOption == true ? '#007aff' : "#d1d1d1",
                        borderWidth: this.state.showOption == true ? 2 : 1,
                        //borderRadius: showOption == true ? 0 : 6,
                        borderTopEndRadius: this.state.showOption == true ? 6 : 6,
                        borderTopStartRadius: this.state.showOption == true ? 6 : 6,
                        borderBottomEndRadius: this.state.showOption == true ? 0 : 6,
                        borderBottomStartRadius: this.state.showOption == true ? 0 : 6,

                    }]}
                        activeOpacity={0.8}
                        onPress={() => this.setState({ showOption: !this.state.showOption })}>
                        <Text style={{
                            fontSize: 14, fontWeight: "500",
                            color: this.state.selectedItem == '' ? "#a6a3a2" : "black",
                            marginRight: 15,
                        }}>{!!this.state.selectedItem ? this.state.selectedItem.name : 'Select'}</Text>
                        <Image
                            style={{
                                transform: [{ rotate: this.state.showOption ? "180deg" : '0deg' }],
                                width: 20,
                                height: 20,
                                marginLeft: 10
                            }}
                            source={require('../../assets/dropdown.jpg')} />
                    </TouchableOpacity>
                    {this.state.showOption && (<View style={{
                        backgroundColor: 'white',
                        marginLeft: 15,
                        width: width - 30,
                        borderBottomEndRadius: 6,
                        borderBottomStartRadius: 6,
                        borderBottomWidth: 2,
                        borderLeftWidth: 2,
                        borderColor: "black",
                        elevation: 10,
                        position: "absolute",
                        marginTop: 65,
                        zIndex: 80
                    }}>
                        {Period.map((val, i) => {
                            return (
                                <TouchableOpacity
                                    key={String(i)}
                                    onPress={() => this.onSelectedItem(val)}
                                    style={{
                                        backgroundColor: this.state.selectedItem.id == val.id ? '#62e1f5' : 'white',
                                        paddingVertical: 8,
                                        //borderRadius:4,
                                        paddingHorizontal: 10,
                                        marginLeft: 0,
                                        //  justifyContent: "flex-start",
                                        width: "100%",
                                        marginBottom: 4,

                                    }}
                                >
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: "500",
                                        color: this.state.selectedItem.id == val.id ? 'white' : 'black',
                                        alignSelf: "flex-end",
                                    }}>{val.name}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>)}



                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    dropDownstyle: {
        backgroundColor: 'white',
        padding: 6,
        borderWidth: 0.5,
        width: width - 30,
        minHeight: 55,
        //alignSelf: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
})
