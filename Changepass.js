import React, { Component } from 'react';
import { Image, View, AsyncStorage, Dimensions, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Card, Footer, Icon, Header, Title, FooterTab, Spinner, CardItem, Thumbnail, Text, Button, Left, Body, Right,Form, Item, Input, Label } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Changepass extends Component {
    state = {
        loading: true
      }

    constructor(props) {  
        super(props);  
        this.state = {cpass:'',
            npass:'',
            rpass:'',
            cpassWarn:'',
            npassWarn:'',
            rpassWarn:'',
            userid:0,
            btnsnipper:0,
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
            this.setState({userid:useruid});
          }
          else{
            this.props.navigation.replace("Login");
          }
        }
        catch(err){
          console.log('Profile Page store error: '+err);
        }
      }

    verify=()=>{
        const cpass = this.state.cpass;
        const npass = this.state.npass;
        const rpass = this.state.rpass;

        if(cpass.length<2){
            this.setState({rpassWarn:""});
            this.setState({cpassWarn:'Password is too short!'});
        }
        else if(npass.length<6){
            this.setState({cpassWarn:''});
            this.setState({npassWarn:'Password length must be 6 - 8'});
        }
        else if(cpass===npass){
            this.setState({npassWarn:''});
            this.setState({cpassWarn:'Current password and New password same!'});
        }
        else if(rpass!==npass){
            this.setState({cpassWarn:''});
            this.setState({npassWarn:''});
            this.setState({rpassWarn:"Password doesn't match!"});
        }
        else{
            this.setState({cpassWarn:''});
            this.setState({npassWarn:''});
            this.setState({rpassWarn:''});
            this.setState({btnsnipper:1});
            this.changeUserPassword();
        }
    }

    changeUserPassword = () =>{
        var InsertAPI = api+'changepass.php';
        var Data={userid:this.state.userid, cpassword:this.state.cpass, npassword:this.state.npass};
        var headers={
        'Accept':'application/json',
        'Content-Type':'application.json'
        }
        fetch(InsertAPI,{
            method:'POST',
            headers:headers,
            body:JSON.stringify(Data),
        }).then((response)=>response.json()).then((response)=>{
            if(response=='True'){
                this.setState({btnsnipper:0});
                this.props.navigation.goBack();
            }
            else if(response=='Pass'){
                this.setState({cpassWarn:'Password Incorrect'});
                this.setState({btnsnipper:0});
            }
            else{
                console.log(response);
                alert('Something went wrong');
                this.setState({btnsnipper:0});
            }
        })
        .catch(err=>{
            console.log(err);
            this.setState({btnsnipper:0});
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
                    <Title>PASSWORD</Title>
                  </Body>
                  <Right />
                </Header>
                
              <Content>
                    <View style={{alignSelf:'center',padding:5, width:width-40}}>
                        <Item style={{marginTop:10}}>
                            <Icon name="key"/>
                            <Input placeholder='Current password'
                            maxLength={8}
                            secureTextEntry={true}
                            onChangeText={(cpass) => this.setState({cpass})}/>
                        </Item>
                        <Text style={{color:'red', marginLeft:5}}>{this.state.cpassWarn}</Text>

                        <Item style={{marginTop:10}}>
                            <Icon name="person"/>
                            <Input placeholder='New password'
                            maxLength={8}
                            secureTextEntry={true}
                            onChangeText={(npass) => this.setState({npass})}/>
                        </Item>
                        <Text style={{color:'red', marginLeft:5}}>{this.state.npassWarn}</Text>

                        <Item style={{marginTop:10}}>
                            <Icon name="refresh"/>
                            <Input placeholder='Re-enter new password'
                            maxLength={8}
                            secureTextEntry={true}
                            onChangeText={(rpass) => this.setState({rpass})}/>
                        </Item>
                        <Text style={{color:'red', marginLeft:5}}>{this.state.rpassWarn}</Text>


                            <View style={{alignSelf:'center', marginTop:20}}>
                            <Button block info 
                                onPress={()=>{this.verify()}}
                              style={{marginTop:5,width:(width/2)+40, borderRadius:30}}>
                                {this.state.btnsnipper==0?
                                <Text>Change Password</Text>:<Spinner color='white' />}
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