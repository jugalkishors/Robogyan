import React from 'react';
import { StyleSheet, LogBox, StatusBar, View } from 'react-native';
import { Container} from 'native-base';
import Root from './Root';


StatusBar.setBackgroundColor('#0099ff',true);

export default class App extends React.Component{
  
  render(){

    return(
        <>
          <Root/>
        </>
    )
  }
}
