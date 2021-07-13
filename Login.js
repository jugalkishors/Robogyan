import React, { Component } from 'react';
import { Image, keyboard, View, AsyncStorage, BackHandler, Alert, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Content, Item, Input, Text, Spinner, Button} from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Login extends Component {
    state = {
        loading: true
      }

      constructor(props) {  
        super(props);  
        this.state = {text: '',pass: '',emailWarn:'',passWarn:'', btnsnipper:0};
      }

      _storeData = async (id,name,email,tagname,img,contact,instagram,facebook,linkedin,github) => {
        AsyncStorage.setItem('userid',id);
        AsyncStorage.setItem('name',name);
        AsyncStorage.setItem('mail',email);
        AsyncStorage.setItem('tagname',tagname);
        AsyncStorage.setItem('image',img);
        AsyncStorage.setItem('instagram',instagram);
        AsyncStorage.setItem('linkedin',linkedin);
        AsyncStorage.setItem('facebook',facebook);
        AsyncStorage.setItem('github',github);
        AsyncStorage.setItem('contact',contact).then(()=>{
            this.setState({btnsnipper:0});
            this.props.navigation.replace("Profile");
        });
      };

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

      backAction = () => {
        Alert.alert("Exit", "Are you sure you want to close App?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };

      componentWillUnmount() {
        console.log('done.');
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
      }

      
    //   componentWillUnmount() {
    //     console.log('zzz')
    //     BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    // }
    

      collectData=()=>{
        var InsertAPI = api+'login.php';
        var Data={email:this.state.text.toLowerCase(), password:this.state.pass};
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
              this._storeData(response[0].userdata.id,response[0].userdata.name,response[0].userdata.email,response[0].userdata.tagname,response[0].userdata.image,response[0].userdata.contact,response[0].userdata.instagram,response[0].userdata.facebook,response[0].userdata.linkedin,response[0].userdata.github);
                //console.log(response[0].userdata.name);
            }
            else{
              this.setState({emailWarn:"Email doesn't exist or password wrong!"});
              this.setState({btnsnipper:0});
            }
        })
        .catch(err=>{
            console.log(err);
            this.setState({btnsnipper:0});
        })
    }


    
      verify=()=>{
        const username = this.state.text;
        const password = this.state.pass;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(reg.test(username)===false){
            this.setState({passWarn:''});
            this.setState({emailWarn:'Invalid email address!!!'});
        }
        else if(password.length<6){
            this.setState({emailWarn:''});
            this.setState({passWarn:'Password length must be 6 - 8!!!'});
        }
        else{
            this.setState({btnsnipper:1});
            this.setState({passWarn:''});
            this.setState({emailWarn:''});
            this.collectData();
          }
      }
    
      async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.backAction);
        //BackHandler.addEventListener("hardwareBackPress", this.backAction);
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
               
            <Content>
                <View>
                    <View style={{flexDirection:'row',backgroundColor:"#0099FF"}}>
                        <View style={{height:(height/3)+30,justifyContent:'center'}}>
                        <Text style={styles.title}>
                            SIGN IN
                        </Text>
                        </View>

                        <View style={{height:(height/3)+30,justifyContent:'center'}}>
                            <Image source={require('./assets/edugyan.png')} style={{height:100, width:100,marginLeft:width/3, resizeMode:'contain'}}/>
                        </View>
                    </View>
                    <Image source={require('./assets/wave.png')} style={{width:width,height:(height/9)+5.5, resizeMode:'stretch', marginTop:0}}/>
                
                    <View style={{alignItems:'center'}}>
                        <View style={styles.LoginBox}>
                            <Item style={{marginTop:10}}>
                                <Image source={require('./assets/emailicon.png')}/>
                                <Input placeholder='Email'
                                keyboardType='email-address'
                                onChangeText={(text) => this.setState({text})}/>
                            </Item>
                            <Text style={{color:'red', marginLeft:5}}>{this.state.emailWarn}</Text>
                            <Item style={{marginTop:10}}>
                                <Image source={require('./assets/keyicon.png')}/>
                                <Input placeholder='Password (maximum 8 digits)'
                                maxLength={8}
                                secureTextEntry={true}
                                onChangeText={(pass) => this.setState({pass})}/>
                            </Item>
                            <Text style={{color:'red', marginLeft:5}}>{this.state.passWarn}</Text>
                            <Button block info  style={{marginTop:20}} onPress={()=>this.verify()}>
                                {this.state.btnsnipper==0?
                                <Text>LOG IN</Text>:<Spinner color='white' />}
                            </Button>
                            
                            <View style={{alignSelf:'center'}}>
                              <Button transparent  onPress={()=>{this.props.navigation.replace("Forgetpass")}}>
                                <Text style={{color:'#898989', marginTop:40, fontSize:15}}>
                                  Forget Password?
                                </Text>
                              </Button>
                            </View>
                        </View>

                        <View style={{marginTop:10, padding:30, alignItems:'center'}}>
                            <TouchableOpacity>
                                <Button transparent  onPress={()=>{this.props.navigation.navigate("Register")}}>
                                    <Text style={{color:'#786D6D'}}>
                                        Not a member? Join Now
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
      height:(height/2),
      width: width-40,
      backgroundColor: '#fff',
      borderRadius:15,
      marginTop:-120,
      shadowRadius:0.5,
      shadowColor:'#000',
      shadowOffset:{width:0.5,height:0.5},
      shadowOpacity:0.5,
      elevation:5,
      padding:15,
    },
  })