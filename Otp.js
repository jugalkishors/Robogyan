import React, { Component } from 'react';
import { Image, View, Dimensions, AsyncStorage, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Card,Header, Title, Spinner, Body, Icon, Item, Text, Button,Left, Right, Input } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Otp extends Component {
    state = {
        loading: true
      }

    constructor(props){
        super(props);
        this.state = {
            name:'',
            email:'',
            otp:'',
            userotp:'',
            password:'',
            contact:'',
            image:'',
            tagname:'',
            userid:'',
            btnsnipper:0,
        }
    }

    _storeData = async () => {
        AsyncStorage.setItem('userid',this.state.userid);
        AsyncStorage.setItem('name',this.state.name);
        AsyncStorage.setItem('mail',this.state.email);
        AsyncStorage.setItem('tagname',this.state.tagname);
        AsyncStorage.setItem('image',this.state.image);
        AsyncStorage.setItem('instagram','');
        AsyncStorage.setItem('linkedin','');
        AsyncStorage.setItem('facebook','');
        AsyncStorage.setItem('github','');
        AsyncStorage.setItem('contact',this.state.contact).then(()=>{
            this.setState({btnsnipper:0});
            this.props.navigation.replace("Profile");
        });
   };

      async componentDidMount() {
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false })
        this.uservalues();
      }

      uservalues=()=>{
          this.setState({
              name:this.props.route.params.name,
              otp:this.props.route.params.otp,
              email:this.props.route.params.email.toLowerCase(),
              contact:this.props.route.params.contact,
              password:this.props.route.params.password,
              image:'https://mandawamart.com/roboclub/api/userImg/avtar.png',
              tagname:'Tech Creator',
            });
      }

      insertData=()=>{
            var InsertAPI = api+'register.php';
            var Data={name:this.state.name,email:this.state.email,password:this.state.password,contact:this.state.contact,active:1,image:this.state.image,tagname:this.state.tagname};
            var headers={
            'Accept':'application/json',
            'Content-Type':'application.json'
            }
            fetch(InsertAPI,{
                method:'POST',
                headers:headers,
                body:JSON.stringify(Data),
            }).then((response)=>response.json()).then((response)=>{
                if(response[0].Msg=='True'){
                    //console.log(response[0]);
                    this.setState({userid:response[0].userid})
                    this._storeData();
                }
                else{
                    alert('Email already exists');
                    this.props.navigation.goBack();
                }
            })
            .catch(err=>{
                console.log(err);
                this.setState({btnsnipper:0});
            })
        }



      verify=()=>{
          if(this.state.userotp==this.state.otp){
              this.setState({btnsnipper:1});
              this.insertData();
          }
          else{
              alert('Incorrect otp, Try Again');
              this.props.navigation.goBack();
          }
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
                    <Title>Verify Email</Title>
                  </Body>
                  <Right />
                </Header>
                
            <Content>
                <View style={{margin:5, alignItems:'center'}}>
                    <View style={styles.OtpBox}>
                        <Text style={{textAlign:'center',fontSize:30}}>
                            One Time Password
                        </Text>
                        <Text style={{textAlign:'center'}}>Check your email</Text>
                        
                        <Item style={{marginTop:30, width:(width/2)+20, alignSelf:'center'}}>
                            <Image source={require('./assets/keyicon.png')}/>
                            <Input
                            keyboardType='numeric'
                            maxLength={6}
                            style={{fontSize:25, textAlign:'center'}}
                            placeholder='Enter your OTP'
                            onChangeText={(userotp) => this.setState({userotp})}/>
                        </Item>

                        <View>
                        <Button block info  style={{marginTop:25}} onPress={()=>{this.verify()}}>
                            {this.state.btnsnipper==0?
                                <Text>Verify</Text>:<Spinner color='white' />}
                            </Button>
                        </View>
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

  OtpBox:{
    height:(height/3)+55,
    width: width-40,
    backgroundColor: '#fff',
    borderRadius:15,
    marginTop:30,
    shadowRadius:0.5,
    shadowColor:'#000',
    shadowOffset:{width:0.5,height:0.5},
    shadowOpacity:0.5,
    elevation:5,
    padding:15,
  },
})