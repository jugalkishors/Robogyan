import React, { Component } from 'react';
import { Image, View, Dimensions, AsyncStorage, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Card, Spinner, Footer, Icon, FooterTab, CardItem, Thumbnail, Text, Button, Left, Body, Right } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Feed extends Component {

  constructor(props) {  
      super(props);  
      this.state={
        caption:'TECH FEED',
        feedLoading:0,
        showfeed:[],
      };
  }
    state = {
        loading: true
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
    
      async componentDidMount() {
        this._retrieveData();
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false })
        this.userfeed();
      }

      //Calculate time
      time_ago=(time)=> {

        switch (typeof time) {
          case 'number':
            break;
          case 'string':
            time = +new Date(time);
            break;
          case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
          default:
            time = +new Date();
        }
        var time_formats = [
          [60, 'sec', 1], // 60
          [120, '1 min ago', '1 minute from now'], // 60*2
          [3600, 'min', 60], // 60*60, 60
          [7200, '1 hr ago', '1 hour from now'], // 60*60*2
          [86400, 'hrs', 3600], // 60*60*24, 60*60
          [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
          [604800, 'days', 86400], // 60*60*24*7, 60*60*24
          [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
          [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
          [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
          [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
          [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
          [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
          [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
          [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time) / 1000,
          token = 'ago',
          list_choice = 1;
      
        if (seconds == 0) {
          return 'Just now'
        }
        if (seconds < 0) {
          seconds = Math.abs(seconds);
          token = 'from now';
          list_choice = 2;
        }
        var i = 0,
          format;
        while (format = time_formats[i++])
          if (seconds < format[0]) {
            if (typeof format[2] == 'string')
              return format[list_choice];
            else
              return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
          }
        return time;
      }


      userfeed=()=>{
        var InsertAPI = api+'allfeed.php';
        var headers={
        'Accept':'application/json',
        'Content-Type':'application.json'
        }
        fetch(InsertAPI,{
            method:'POST',
            headers:headers,
        }).then((response)=>response.json()).then((response)=>{
          if(response===null){
            this.setState({caption:'No feed to show'});
            this.setState({feedLoading:1});
          }
          else{
            this.setState({showfeed:response});
            this.setState({feedLoading:1});
          }
        })
        .catch(err=>{
            alert('Something went wrong');
            this.setState({feedLoading:1});
        })
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
                    <Title>TECH FEED</Title>
                  </Body>
                  <Right />
                </Header>
                
                <Content>
                  {this.state.feedLoading==0?
                    <View style={{padding:10, marginTop:20}}>
                      <Thumbnail source={require('./assets/feedload.gif')}
                        style={{height:height,width:width, resizeMode:'contain'}}
                      />
                    </View>:<View style={{padding:10, marginTop:20}}>
                    {this.state.showfeed.map((item, index) => {
                    return(
                      <Card>
                        <CardItem>
                        <Left>
                          <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Userprofile",{userid:item.uid, username:item.username, userimg:item.userimg, usertag:item.tagname})}}>
                            <Thumbnail source={{uri: item.userimg}}/>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Userprofile",{userid:item.uid, username:item.username, userimg:item.userimg, usertag:item.tagname})}}>
                            <Body>
                            <Text>{item.username}</Text>
                            <Text note>{item.tagname}</Text>
                            </Body>
                          </TouchableOpacity>
                        </Left>
                        </CardItem>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("ImageShow",{id:item.id})}}>
                        <CardItem cardBody>
                        <Image
                        source={{uri: item.image}} style={{height: 200, width: null, flex: 1}}/>
                        </CardItem>
                        </TouchableOpacity>
                        <CardItem>
                        <Left>
                            <Text>{item.category}</Text>
                        </Left>
                        <Body>
                            <Button transparent onPress={()=>{this.props.navigation.navigate("Comments",{pid:item.id})}}>
                            <Image source={require('./assets/comment.png')} style={{height:30, width:30}} />
                            <Text>FAQs</Text>
                            </Button>
                        </Body>
                        <Right>
                            <Text>{this.time_ago(parseInt(item.posttime))}</Text>
                        </Right>
                        </CardItem>
                      </Card>
                      );
                    })}
                  </View>}
                </Content>


              <Footer>
          <FooterTab style={{backgroundColor:'#fff'}}>
            <Button onPress={()=>{this.props.navigation.replace("Home")}}>
              <Icon name="home" />
            </Button>
            <Button active  style={{backgroundColor:'#0099ff'}}>
              <Icon name="grid" />
            </Button>
            <Button onPress={()=>{this.props.navigation.replace("Search")}}>
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