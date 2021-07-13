import React, { Component } from "react";
import { Image, keyboard, Modal, LogBox, ScrollView, AsyncStorage, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Header, Title, FooterTab, Footer, Spinner, Textarea, Content, Card, CardItem, Text, Body, View, Fab, Left, Right, Button, Icon, List, ListItem, Thumbnail, Item } from "native-base";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';
import { WebView } from 'react-native-webview';

LogBox.ignoreAllLogs();

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Help extends Component {
    constructor(props) {
        super(props)
        this.state = {
          active: false,
          modalVisible:true,
        };
      }

      _retrieveData = async () => {
        try{
        const useruid = await AsyncStorage.getItem('userid').then((value) => {
          this.decision();
      });
      }
      catch(err){
        console.log('Profile Page store error: '+err);
      }
      };
    
      decision=async ()=>{
        try{
          const useruid = await AsyncStorage.getItem('userid');
          if (useruid!==null) {
          }
          else{
            this.props.navigation.replace("Login");
          }
        }
        catch(err){
          console.log('Profile Page store error: '+err);
        }
      }


      

      async componentDidMount() {
          this._retrieveData();
        
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false })
      }

  render() {
    return (
      <Container>
          <Header style={{backgroundColor:'#0099ff'}} androidStatusBarColor='#0099ff'>
            <Left>
                <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
                    <Icon name='arrow-back' />
                </Button>
            </Left>
            <Body>
                <Title>Help</Title>
            </Body>
            <Right />
        </Header>
        <Content>
            <View style={{height:(height/2)+150, marginTop:20}}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    scrollEnabled={false}
                     source={{ uri:'https://mail.google.com/mail/u/0/?view=cm&fs=1&to=edugyan100@gmail.com&su=Contact%20mail%20to%20RoboGYAN&tf=1' }}
                      onLoadStart={() => this.setState({modalVisible:true})}
                    onLoad={() => this.setState({modalVisible:false})}/>
                </View>


                <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            >
                            <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                    <Thumbnail source={require('./assets/faq.gif')}
                                    style={{height:height/4,width:width, resizeMode:'contain'}}
                                    />
                                        <Text note style={{fontSize:20}}>Loading</Text>
                                    </View>
                            </View>
                        </Modal>
                    </View>
        </Content>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      width:(width/2)+50,
      justifyContent:'center',
      height:height/3,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });