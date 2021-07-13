import React, { Component } from 'react';
import { Image, View, Dimensions, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content,Header, Title, Card, Footer, Icon, FooterTab, Spinner, CardItem, Thumbnail, Text, Button, Left, Body, Right,Form, Item, Input, Label } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Forgetpass extends Component {
    state = {
        loading: true
      }

    constructor(props) {  
        super(props);  
        this.state = {curmail:'', curmailWarn:'', btnsnipper:0};
    }

    verify=()=>{
        const curmail = this.state.curmail;
        
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(reg.test(curmail)===false){
            this.setState({curmailWarn:'Invalid email address!!!'});
        }
        else{
          this.setState({btnsnipper:1});
          this.setState({curmailWarn:''});
          this.changePass();
        }
    }

    changePass=()=>{
      var InsertAPI = api+'forgetpass.php';
      var rendomval =Math.floor(Math.random()*999999+100000);
      var Data={email:this.state.curmail.toLowerCase(), temppass:rendomval};
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
            alert('We sent you email, Check it now.');
            this.props.navigation.goBack();
          }
          else if(response==='Wrong'){
            this.setState({curmailWarn:"Email doesn't exist!"});
            this.setState({btnsnipper:0});
          }
          else{
            alert('Something went wrong');
          }
          
      })
      .catch(err=>{
          console.log(err);
          this.setState({btnsnipper:0});
      })
  }
    
      async componentDidMount() {
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
               <Header style={{backgroundColor:'#0099ff'}} androidStatusBarColor='#0099ff'>
               <Left>
                  <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
                    <Icon name='arrow-back' />
                  </Button>
                </Left>
                  <Body>
                    <Title>FOGET PASSWORD</Title>
                  </Body>
                  <Right />
                </Header>
                
              <Content>
                    <View style={{alignSelf:'center',padding:5, width:width-40}}>
                        <Item style={{marginTop:10}}>
                            <Icon name="mail"/>
                            <Input placeholder='Enter Registered Email'
                            keyboardType='email-address'
                            onChangeText={(curmail) => this.setState({curmail})}/>
                        </Item>
                        <Text style={{color:'red', marginLeft:5}}>{this.state.curmailWarn}</Text>

                            <View style={{alignSelf:'center', marginTop:20}}>
                            <Button block info 
                                onPress={()=>{this.verify()}}
                              style={{marginTop:5,width:(width/2)+40, borderRadius:30}}>
                                {this.state.btnsnipper==0?
                                <Text>SEND RESET LINK</Text>:<Spinner color='white' />}
                            </Button>
                            </View>
                    </View>
                </Content>

              </Container>
    );
  }
}

const styles = StyleSheet.create({
  myHeader:{
      height:60,
      backgroundColor:'#0099FF',
      justifyContent:'center',
      padding:15,
      elevation:7,
  },
  headerText:{
      fontSize:25,
      fontWeight:'bold',
      color:'#fff',
  },
})