import React, { Component } from 'react';
import { Image,  TouchableHighlight, Modal, AsyncStorage, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Text, Spinner, Textarea, Header, View, Button, Icon, Fab, Tab, Tabs, ScrollableTab, Left, Right, Body, Title, Subtitle, Thumbnail, Content } from 'native-base';
import { WebView } from 'react-native-webview';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';


StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Membership extends Component {
    constructor(props) {
        super(props)
        this.state = {
          btnsnipper:1,
          useruid:0,
          username:'',
          email:'',
          contact:'',
          purpose:'Club Membership',
          amount: 200,
          apilink:'',
          modalVisible:false,
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
            const nameuser = await AsyncStorage.getItem('name');
            const usermail = await AsyncStorage.getItem('mail');
            const usercontact = await AsyncStorage.getItem('contact');
            
            this.setState({apilink:api+'membership_payment/pay.php?purpose=Club_Membership&name='+nameuser+'&email='+usermail+'&amount=200&id='+useruid+'&phone='+usercontact});
            this.setState({useruid:useruid});
            this.setState({username:nameuser});
            this.setState({email:usermail});
            this.setState({contact:usercontact});
            
            this.verifyyy();
          }
          else{
            this.props.navigation.replace("Login");
          }
        }
        catch(err){
          console.log('Profile Page store error: '+err);
        }
      }


      verifyyy=()=>{
        var InsertAPI = api+'payverify.php';
        var Data={cat:this.state.useruid};
        var headers={
        'Accept':'application/json',
        'Content-Type':'application.json'
        }
        fetch(InsertAPI,{
            method:'POST',
            headers:headers,
            body:JSON.stringify(Data),
        }).then((response)=>response.json()).then((response)=>{
          if(response==='True'){
            this.setState({btnsnipper:0});
          }
          else{
            alert('You have already membership.');
            this.props.navigation.goBack();
            this.setState({btnsnipper:0});
          }
        })
        .catch(err=>{
            console.log(err);
            this.setState({btnsnipper:0});
            alert('Something went wrong!!!');
        })
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
            <Title>MEMBERSHIP</Title>
          </Body>
          <Right />
        </Header>
        <Content>
        <View style={{height:height}}>
        {this.state.btnsnipper==1?
            <Spinner color='#0099ff' style={{marginTop:height/3}}  />:<WebView source={{ uri: this.state.apilink }} onLoadStart={() => this.setState({modalVisible:true})}
            onLoad={() => this.setState({modalVisible:false})}/>}
        </View>


        <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    >
                    <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                            <Thumbnail source={require('./assets/payload.gif')}
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