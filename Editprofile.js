import React, { Component } from 'react';
import { Image, View, AsyncStorage, Dimensions,Platform, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Card, Footer, Icon, Spinner, FooterTab, CardItem, Thumbnail, Text, Button, Left, Body, Right,Form, Item, Input, Label } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Editprofile extends Component {
    state = {
        loading: true
      }

    constructor(props) {  
        super(props);  
        this.state = {name:'',email:'',designation:'',phone:'',nameWarn:'',emailWarn:'',phoneWarn:'', 
        avtar:'https://www.w3schools.com/howto/img_avatar.png',
        useruid:'',
        btnsnipper:0,
        Imgbtnsnipper:0,
        Btnaction:false,
        imgBtnaction:false,
        instagram:'',
        facebook:'',
        linkedin:'',
        github:'',
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
          const designuser = await AsyncStorage.getItem('tagname');
          const imguser = await AsyncStorage.getItem('image');
          const mailuser = await AsyncStorage.getItem('mail');
          const usercontact = await AsyncStorage.getItem('contact');
          const insta = await AsyncStorage.getItem('instagram');
          const fb = await AsyncStorage.getItem('facebook');
          const linkd = await AsyncStorage.getItem('linkedin');
          const git = await AsyncStorage.getItem('github');
          
          this.setState({useruid:useruid});
          this.setState({name:nameuser});
          this.setState({designation:designuser});
          this.setState({avtar:imguser});
          this.setState({email:mailuser});
          this.setState({phone:usercontact});
          this.setState({instagram:insta});
          this.setState({facebook:fb});
          this.setState({linkedin:linkd});
          this.setState({github:git});
        }
        else{
          this.props.navigation.replace("Login");
        }
      }
      catch(err){
        console.log('Profile Page store error: '+err);
      }
    }

    storeImg = async (img)=>{
      AsyncStorage.setItem('image',img).then(()=>{
            this.setState({Imgbtnsnipper:0});
            this.props.navigation.replace("Profile");
        });
    }

    storeData = async ()=>{
        AsyncStorage.setItem('name',this.state.name);
        AsyncStorage.setItem('tagname',this.state.designation);
        AsyncStorage.setItem('instagram',this.state.instagram);
        AsyncStorage.setItem('linkedin',this.state.linkedin);
        AsyncStorage.setItem('facebook',this.state.facebook);
        AsyncStorage.setItem('github',this.state.github);
        AsyncStorage.setItem('contact',this.state.phone).then(()=>{
            this.setState({btnsnipper:0});
            this.setState({imgBtnaction:false});
            this.props.navigation.navigate("Home");
        });
    }

    verify=()=>{
        const email = this.state.email;
        const usertitle = this.state.designation;
        const name = this.state.name;
        const phone = this.state.phone;
        if(name.length<1){
            this.setState({phoneWarn:''});
            this.setState({nameWarn:'Please enter name!!!'});
        }
        else if(phone.length<10){
            this.setState({emailWarn:''});
            this.setState({phoneWarn:'Please enter valid Password!!!'});
        }
        else{
            this.setState({emailWarn:''});
            this.setState({nameWarn:''});
            this.setState({phoneWarn:''});
            this.setState({btnsnipper:1});
            this.setState({imgBtnaction:true})
            
            this.updateProfile();
        }
    }

    updateProfile=()=>{
        var InsertAPI = api+'userupdate.php';
        var Data={name:this.state.name,tagname:this.state.designation,contact:this.state.phone,userid:this.state.useruid,instagram:this.state.instagram,facebook:this.state.facebook,linkedin:this.state.linkedin,github:this.state.github};
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
              this.storeData();
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

    dataUpdation= async ()=>{
      const response = await fetch(this.state.avtar);
      const blob = await response.blob();
      var reader = new FileReader();
      reader.onload = () => {
  
        var InsertAPI = api+'insertimg.php';
        var Data={img:reader.result, userid:this.state.useruid};
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
          this.setState({avtar:response[0].img});
          this.storeImg(response[0].img);
        }
      })
      .catch(err=>{
        console.log(err);
        this.setState({Imgbtnsnipper:0});
        this.setState({Btnaction:false});
      })  
  }
  reader.readAsDataURL(blob);
    }
    
      async componentDidMount() {
        this._retrieveData();
            if (Platform.OS !== 'web') {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
              }
            }

        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false })
      }


      pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
    
        if (!result.cancelled) {
          this.setState({avtar:result.uri});
          this.setState({Imgbtnsnipper:1});
          this.setState({Btnaction:true});
          this.dataUpdation();
        }
      };


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
                    <Title>EDIT PROFILE</Title>
                  </Body>
                  <Right />
                </Header>
                
              <Content>
                  <View style={{marginTop:90, alignItems:'center'}}>
                    <View style={styles.profileimg}>
                        <Thumbnail
                        source={{uri:this.state.avtar}}
                        style={{height:130,width:130, borderRadius:65}}
                        />
                    </View>
                    <View>
                        <Button disabled={this.state.imgBtnaction} style={{borderRadius:25, height:35, backgroundColor:'#0099ff'}} onPress={this.pickImage}>
                          {this.state.Imgbtnsnipper==0?
                          <><Icon name="camera"/><Text style={{marginLeft:-25,fontSize:10}}>Change Picture</Text></>:<Spinner color='white' />}   
                        </Button>
                    </View>
                  </View>

                  <View style={{alignSelf:'center',padding:10, width:width-40}}>
                    <Item style={{marginTop:10}}>
                        <Icon name="person"/>
                        <Input placeholder='Name'
                        maxLength={20}
                        value={this.state.name}
                        onChangeText={(name) => this.setState({name})}/>
                    </Item>
                    <Text style={{color:'red', marginLeft:5}}>{this.state.nameWarn}</Text>

                    <Item style={{marginTop:2}}>
                        <Icon name="copy"/>
                        <Input placeholder="You want to become a ..."
                        maxLength={15}
                        value={this.state.designation}
                        onChangeText={(designation) => this.setState({designation})}/>
                    </Item>
                    <Text></Text>

                    <Item style={{marginTop:2}}>
                        <Icon name="mail"/>
                        <Input placeholder='Email address'
                        keyboardType='email-address'
                        maxLength={30}
                        disabled={true}
                        value={this.state.email+' (disabled)'}
                        style={{color:'#6F6F6F'}}
                        />
                    </Item>
                    <Text style={{color:'red', marginLeft:5}}>{this.state.emailWarn}</Text>

                    <Item style={{marginTop:2}}>
                        <Icon name="call"/>
                        <Input placeholder='Contact number'
                        keyboardType='numeric'
                        maxLength={10}
                        value={this.state.phone}
                        onChangeText={(phone) => this.setState({phone})}/>
                    </Item>
                    <Text style={{color:'red', marginLeft:5}}>{this.state.phoneWarn}</Text>
                    
                    <Item style={{marginTop:2}}>
                        <Thumbnail source={require('./assets/insta.png')} style={{height:20, marginLeft:-15, resizeMode:'contain'}}/>
                        <Input placeholder='Username eg: john1029'
                        maxLength={200}
                        value={this.state.instagram}
                        onChangeText={(instagram) => this.setState({instagram})}/>
                    </Item>

                    <Item style={{marginTop:2}}>
                        <Thumbnail source={require('./assets/fb.png')} style={{height:20, marginLeft:-15, resizeMode:'contain'}}/>
                        <Input placeholder='Username eg: john1029'
                        maxLength={200}
                        value={this.state.facebook}
                        onChangeText={(facebook) => this.setState({facebook})}/>
                    </Item>

                    <Item style={{marginTop:2}}>
                        <Thumbnail source={require('./assets/linkedin.png')} style={{height:20, marginLeft:-15, resizeMode:'contain'}}/>
                        <Input placeholder='Username eg: john1029'
                        maxLength={200}
                        value={this.state.linkedin}
                        onChangeText={(linkedin) => this.setState({linkedin})}/>
                    </Item>

                    <Item style={{marginTop:2}}>
                        <Thumbnail source={require('./assets/github.png')} style={{height:20, marginLeft:-15, resizeMode:'contain'}}/>
                        <Input placeholder='Username eg: john1029'
                        maxLength={200}
                        value={this.state.github}
                        onChangeText={(github) => this.setState({github})}/>
                    </Item>

                    <View style={{alignSelf:'center'}}>
                    <Button block info disabled={this.state.Btnaction}
                        onPress={()=>{this.verify()}}
                        style={{marginTop:10,width:(width/2)+40, borderRadius:30}}>
                                {this.state.btnsnipper==0?
                                <Text>Change Profile</Text>:<Spinner color='white' />}
                            </Button>
                    </View>
                    </View>
                
              </Content>


              <Footer>
          <FooterTab style={{backgroundColor:'#fff'}}>
            <Button onPress={()=>{this.props.navigation.replace("Home")}}>
              <Icon name="home" />
            </Button>
            <Button onPress={()=>{this.props.navigation.replace("Feed")}}>
              <Icon name="grid" />
            </Button>
            <Button onPress={()=>{this.props.navigation.replace("Search")}}>
              <Icon name="search" />
            </Button>
            <Button onPress={()=>{this.props.navigation.replace("Upload")}}>
              <Icon active name="paper-plane" />
            </Button>
            <Button active  style={{backgroundColor:'#0099ff'}} onPress={()=>{this.props.navigation.replace("Profile")}}>
              <Icon name="person" />
            </Button>
          </FooterTab>
        </Footer>
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
  profileimg:{
    alignSelf:'center',
    marginTop:-80,
    borderWidth: 8,
    borderRadius:80,
    borderColor:'rgba(254, 254, 254, 0.5)',
  },
})