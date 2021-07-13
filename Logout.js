import React, { Component } from 'react';
import { Image, View, AsyncStorage, Dimensions, StatusBar } from 'react-native';
import { Container } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Logout extends Component {
    state = {
        loading: true
      }

      clearAll = async () => {
      await AsyncStorage.clear().then(()=>{
        this.props.navigation.replace("Login");
          console.log('SignOut');
      })

      console.log('Done.')
  }
    
      async componentDidMount() {
        this.clearAll();
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false })
      }

  render() {
    if (this.state.loading) {
        return (
          <View></View>
        );
      }
    return (
    <Container>
        
     </Container>
    );
  }
}
