import React, { Component } from "react";
import { Image, keyboard, AsyncStorage, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Spinner, Card,Item, Input, CardItem, Text, Body, View, Fab, Left, Right, Button, Icon, List, ListItem, Thumbnail } from "native-base";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
          btnsnipper:1,
          showfeed:[],
          caption:'',
          searchproject:'',
        };
      }

      searchchecking = ()=>{
        if(this.state.searchproject.length>1){
          this.setState({btnsnipper:1});
          this.projectsearching();
        }
      }

      projectsearching=()=>{
        var InsertAPI = api+'searchproject.php';
        var Data={cat:this.props.tag, keyword:this.state.searchproject};
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

      allprojectfeed=()=>{
        var InsertAPI = api+'projectfeed.php';
        var Data={cat:this.props.tag};
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
        <View style={{padding:10}}>
                     <Item regular style={{height:40, backgroundColor:'#fff', borderRadius:20}}>
                        <Input placeholder='Search project...'
                        onChangeText={(searchproject) =>{this.setState({searchproject}); this.searchchecking()}}/>
                        <Icon name="search"/>
                    </Item>
            </View>

          {this.state.btnsnipper==0?
                  <View>
                {this.state.showfeed==null?
                  <Text style={{textAlign:'center', marginTop:50}}>No Discussion found !</Text>:<List  dataArray={this.state.showfeed} renderRow={(item) =>
                    <ListItem thumbnail onPress={()=>{this.props.navigation.navigate('Projectview', {title:item.title, userid:item.uid, userimg:item.userimg, username:item.username, tagname:item.tagname, projectid:item.id})}}>
                      <Left>
                        <Thumbnail source={require('./assets/projectlogo.png')}
                        style={{resizeMode:'contain'}} />
                      </Left>
                      <Body>
                        <Text numberOfLines={2}>{item.title}</Text>
                        <Text note>{item.username}</Text>
                      </Body>
                      
                  </ListItem>}/>}
                  </View>:<Thumbnail source={require('./assets/searchprofile.gif')}
                          style={{height:height/3,width:width, resizeMode:'contain'}}
            />}  
            
      </Container>
    );
  }
}