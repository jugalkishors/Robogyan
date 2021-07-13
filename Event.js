import React, { Component } from "react";
import { Image, keyboard, Linking, AsyncStorage, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Title, Spinner, Card,Item, Input, CardItem, Text, Body, View, Fab, Left, Right, Button, Icon, List, ListItem, Thumbnail } from "native-base";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
          btnsnipper:1,
          showfeed:[],
          caption:'',
          searchproject:'',
        };
      }

      allprojectfeed=()=>{
        var InsertAPI = api+'allevents.php';
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
            this.setState({btnsnipper:0});
          }
          else{
            
            this.setState({showfeed:response});
            this.setState({btnsnipper:0});
          }
        })
        .catch(err=>{
            alert('Something went wrong');
            this.setState({feedLoading:0});
        })
      }

      linkAction=(link, active)=>{
        if(active==0){
          alert('Link will available on event time.');
        }
        else{
          Linking.openURL(link);
        }
      }

      async componentDidMount() {
        this.allprojectfeed();
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
            <Title>EVENTS</Title>
          </Body>
          <Right />
        </Header>
 

          {this.state.btnsnipper==0?
                  <View>
                {this.state.showfeed==null?
                  <Text style={{textAlign:'center', marginTop:50}}>No Event found !</Text>:<List  dataArray={this.state.showfeed} renderRow={(item) =>
                    <ListItem thumbnail onPress={()=>this.linkAction(item.link, item.link_active)}>
                      <Left>
                        <Thumbnail source={require('./assets/projectlogo.png')}
                        style={{resizeMode:'contain'}} />
                      </Left>
                      <Body>
                        <Text numberOfLines={2}>{item.event}</Text>
                        <Text note>Time: {item.time} and Date: {item.date}</Text>
                      </Body>
                      
                  </ListItem>}/>}
                  </View>:<Thumbnail source={require('./assets/searchprofile.gif')}
                          style={{height:height/3,width:width, resizeMode:'contain'}}
            />}  
            
      </Container>
    );
  }
}