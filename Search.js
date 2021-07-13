import React, { Component } from 'react';
import { Image, View, AsyncStorage, LogBox, Dimensions, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Card, Footer, Icon, Spinner, FooterTab, List, ListItem, CardItem, Thumbnail, Text, Button, Left, Body, Right, Item, Input} from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';


StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Search extends Component {
  
    state = {
        loading: true
      }

      constructor(props){
        super(props);
        this.state = {
          searchtxt:'',
          btnsnipper:0,
          users:[],
      }
    }

      checking=()=>{
        if(this.state.searchtxt.length<2){

        }
        else{
          this.setState({btnsnipper:1});
          this.searchuser();
        }
      }

      _retrieveData = async () => {
        try{
          const useruid = await AsyncStorage.getItem('userid').then((value) => {
            this.checkUser();
        });
        }
        catch(err){
          console.log('Profile Page store error: '+err);
        }
      };
  
      checkUser = async ()=>{
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

      searchuser=()=>{
        var InsertAPI = api+'search.php';
        var Data={search:this.state.searchtxt};
        var headers={
        'Accept':'application/json',
        'Content-Type':'application.json'
        }
        fetch(InsertAPI,{
            method:'POST',
            headers:headers,
            body:JSON.stringify(Data),
        }).then((response)=>response.json()).then((response)=>{
          if(response===null){
            this.setState({users:null});
            this.setState({btnsnipper:0});
          }
          else{
            this.setState({users:response});
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
                    <Title>SEARCH</Title>
                  </Body>
                  <Right />
                </Header>
               <View style={{backgroundColor:'#0099ff', padding:10}}>
                     <Item regular style={{height:40, backgroundColor:'#fff', borderRadius:20}}>
                        <Input placeholder='Search creator'
                        onChangeText={(searchtxt) =>{this.setState({searchtxt}); this.checking()}}/>
                        <Icon name="search"/>
                    </Item>
                </View>
                
              
              {this.state.btnsnipper==0?
                  <View>
                {this.state.users==null?
                  <Text style={{textAlign:'center', marginTop:50}}>User not found !</Text>:<List  dataArray={this.state.users} renderRow={(item) =>
                    <ListItem thumbnail onPress={()=>{this.props.navigation.navigate("Userprofile",{userid:item.id, username:item.name, userimg:item.image, usertag:item.tagname,instagram:item.instagram,facebook:item.facebook,linkedin:item.linkedin,github:item.github})}}>
                      <Left>
                        <Thumbnail rounded source={{uri:item.image}} />
                      </Left>
                      <Body>
                        <Text>{item.name}</Text>
                        <Text note numberOfLines={1}>{item.tagname}</Text>
                      </Body>
                      
                </ListItem>}/>}
                </View>:<Thumbnail source={require('./assets/searchprofile.gif')}
                        style={{height:height/3,width:width, resizeMode:'contain'}}
                      />}
            
            <Content>
             </Content>


              <Footer>
          <FooterTab style={{backgroundColor:'#fff'}}>
            <Button onPress={()=>{this.props.navigation.replace("Home")}}>
              <Icon name="home" />
            </Button>
            <Button onPress={()=>{this.props.navigation.replace("Feed")}}>
              <Icon name="grid" />
            </Button>
            <Button active  style={{backgroundColor:'#0099ff'}}>
              <Icon name="search" />
            </Button>
            <Button onPress={()=>{this.props.navigation.replace("Upload")}}>
              <Icon active name="paper-plane" />
            </Button>
            <Button onPress={()=>{this.props.navigation.replace("Profile")}}>
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
      height:120,
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