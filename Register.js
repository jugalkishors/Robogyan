import React, { Component } from 'react';
import { Image, View, AsyncStorage, Linking, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Content, Item, CheckBox, Input, Text, Button, Spinner} from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Register extends Component {
    state = {
        loading: true
      }
    constructor(props) {  
        super(props);  
        this.state = {text: '', checkWarn:'',pass: '',uname: '',phone: '',emailWarn:'',passWarn:'',nameWarn:'',phoneWarn:'', btnsnipper:0,check:false};
    }

    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('userid');
          if (value !== null) {
            this.props.navigation.replace("Profile");
          }
        } catch (error) {
          // Error retrieving data
        }
      };
      
    verify=()=>{
        const username = this.state.text;
        const password = this.state.pass;
        const name = this.state.uname;
        const phone = this.state.phone;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(name.length<1){
          this.setState({checkWarn:''});
            this.setState({nameWarn:'Please enter name!!!'});
        }
        else if(reg.test(username)===false){
            this.setState({nameWarn:''});
            this.setState({emailWarn:'Invalid email address!!!'});
        }
        else if(password.length<6){
            this.setState({emailWarn:''});
            this.setState({passWarn:'Password length must be 6 - 8!!!'});
        }
        else if(phone.length<10){
            this.setState({passWarn:''});
            this.setState({phoneWarn:'Please enter valid Password!!!'});
        }
        else if(!this.state.check){
          this.setState({phoneWarn:''});
          this.setState({checkWarn:'Agree it!'});
        }
        else{
            //this.setState({btnsnipper:1});
            this.setState({passWarn:''});
            this.setState({emailWarn:''});
            this.setState({nameWarn:''});
            this.setState({phoneWarn:''});
            this.setState({checkWarn:''});
            this.registerUser();
        }
    }


    registerUser=()=>{
        this.setState({btnsnipper:1});
        var InsertAPI = api+'otp.php';
        var rendomval =Math.floor(Math.random()*999999+100000);
        var Data={email:this.state.text, otp:rendomval};
        var headers={
          'Accept':'application/json',
          'Content-Type':'application.json'
        }
        fetch(InsertAPI,{
            method:'POST',
            headers:headers,
            body:JSON.stringify(Data),
           }).then((response)=>response.json()).then((response)=>{
               //console.log(response);
               this.setState({btnsnipper:0});
                this.props.navigation.navigate("Otp",{
                    otp:rendomval,
                    name:this.state.uname,
                    email:this.state.text,
                    contact:this.state.phone,
                    password:this.state.pass,
                    })
          })
          .catch(err=>{
              console.log(err);
              this.setState({btnsnipper:0});
            })
    }

    checkboxverify=()=>{
      if(this.state.check)
        this.setState({check:false});
      else
        this.setState({check:true});
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

      sendData=()=>{
          this.props.navigation.navigate("Otp",{name:'Jugal',year:'3rd Year'})
      }

  render() {
    if (this.state.loading) {
        return (
          <View></View>
        );
      }
    return (
    <Container>
               
            <Content>
                <View>
                    <View style={{flexDirection:'row',backgroundColor:"#0099FF"}}>
                        <View style={{height:(height/3)+30,justifyContent:'center'}}>
                        <Text style={styles.title}>
                            SIGN UP
                        </Text>
                        </View>

                        <View style={{height:(height/3)+30,justifyContent:'center'}}>
                            <Image source={require('./assets/edugyan.png')} style={{height:100, width:100,marginLeft:width/3, resizeMode:'contain'}}/>
                        </View>
                    </View>
                    <Image source={require('./assets/wave.png')} style={{width:width,height:(height/9)+5.5, resizeMode:'stretch', marginTop:0}}/>
                
                    <View style={{alignItems:'center'}}>
                        <View style={styles.LoginBox}>
                            <Item style={{marginTop:5}}>
                                <Image source={require('./assets/usericon.png')}/>
                                <Input placeholder='Name'
                                onChangeText={(uname) => this.setState({uname})}/>
                            </Item>
                            <Text style={{color:'red', marginLeft:5}}>{this.state.nameWarn}</Text>
                            <Item style={{marginTop:2}}>
                                <Image source={require('./assets/emailicon.png')}/>
                                <Input placeholder='Email'
                                autoCapitalize = 'none'
                                keyboardType='email-address'
                                onChangeText={(text) => this.setState({text})}/>
                            </Item>
                            <Text style={{color:'red', marginLeft:5}}>{this.state.emailWarn}</Text>
                            <Item style={{marginTop:2}}>
                                <Image source={require('./assets/keyicon.png')}/>
                                <Input secureTextEntry={true}
                                maxLength={8}
                                placeholder='Create Password (maxlength : 8)'
                                onChangeText={(pass) => this.setState({pass})}/>
                            </Item>
                            <Text style={{color:'red', marginLeft:5}}>{this.state.passWarn}</Text>
                            <Item style={{marginTop:2}}>
                                <Image source={require('./assets/phoneicon.png')}/>
                                <Input placeholder='Contact number'
                                keyboardType='number-pad'
                                 maxLength={10}
                                 onChangeText={(phone) => this.setState({phone})}/>
                            </Item>
                            <Text style={{color:'red', marginLeft:5}}>{this.state.phoneWarn}</Text>
                            
                            <View style={{flexDirection:'row'}}>
                            <CheckBox onPress={()=>this.checkboxverify()} checked={this.state.check} /><Text style={{marginLeft:15}} onPress={()=>Linking.openURL('https://mandawamart.com/privacy/roboclub_policy.php')}>I agree terms & conditions</Text>
                            </View>
                            <Text style={{color:'red', marginLeft:5}}>{this.state.checkWarn}</Text>

                            <Button block info  style={{marginTop:5}} onPress={()=>{this.verify()}}>
                            {this.state.btnsnipper==0?
                                <Text>REGISTER</Text>:<Spinner color='white' />}
                            </Button>
                        </View>

                        <View style={{marginTop:10, padding:30, alignItems:'center'}}>
                            <TouchableOpacity>
                                <Button transparent>
                                    <Text style={{color:'#786D6D'}} onPress={()=>{this.props.navigation.replace("Login")}}>
                                        Already have account? Sign up
                                    </Text>
                                </Button>
                            </TouchableOpacity>
                        </View>
                    </View>
                
                </View>
            </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    title:{
      fontFamily:'Roboto',
      fontSize:30,
      padding:15,
      color:'white',
    },
    LoginBox:{
      height:(height/2)+85,
      width: width-40,
      backgroundColor: '#fff',
      borderRadius:15,
      marginTop:-150,
      shadowRadius:0.5,
      shadowColor:'#000',
      shadowOffset:{width:0.5,height:0.5},
      shadowOpacity:0.5,
      elevation:5,
      padding:15,
    },
  })