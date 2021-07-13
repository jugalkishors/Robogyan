import React, { Component } from 'react';
import { Image, keyboard, AsyncStorage, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Title, Spinner, Card,Item, Input, CardItem, Text, Body, View, Fab, Left, Right, Button, Icon, List, ListItem, Thumbnail } from "native-base";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Clubcomponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          btnsnipper:1,
          showfeed:[],
          caption:'',
          userid:0,
          searchproject:'',
          footericon:1,
        };
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
            this.setState({userid:useruid});
            this.setState({footericon:0});
            this.allcomponent();
          }
          else{
            this.props.navigation.replace("Login");
          }
        }
        catch(err){
          console.log('Profile Page store error: '+err);
        }
      }

      allcomponent=()=>{
        var InsertAPI = api+'allcomponent.php';
        var Data={uid:this.state.userid};
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
        this._retrieveData();

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
        {/* <View style={styles.myHeader}>
          <Text style={styles.headerText}>Arduino</Text>
            
        </View> */}
        <Header style={{backgroundColor:'#0099ff'}} androidStatusBarColor='#0099ff'>
        <Left>
                  <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
                    <Icon name='arrow-back' />
                  </Button>
                </Left>
          <Body>
            <Title>COMPONENTS</Title>
          </Body>
          <Right />
        </Header>

        <View>
        {this.state.btnsnipper==0?
                  <View>
                {this.state.showfeed==null?
                  <Text style={{textAlign:'center', marginTop:50}}>No Discussion found !</Text>:<List  dataArray={this.state.showfeed} renderRow={(item) =>
                    <ListItem thumbnail>
                      <Left>
                        <Thumbnail source={require('./assets/projectlogo.png')}
                        style={{resizeMode:'contain'}} />
                      </Left>
                      <Body>
                        <Text numberOfLines={2}>{item.component}</Text>
                        <Text note>Date: {item.date} and Quantity: {item.qty}</Text>
                      </Body>
                      
                  </ListItem>}/>}
                  </View>:<Thumbnail source={require('./assets/searchprofile.gif')}
                          style={{height:height/3,width:width, resizeMode:'contain'}}
            />}
        </View>
       <Content></Content>
        
        <View>
        {this.state.footericon==1?
        <></>:<Fab
        active={this.state.active}
        direction="up"
        containerStyle={{}}
        style={{ backgroundColor: '#0099ff' }}
        position="bottomRight"
        onPress={() =>{this.props.navigation.navigate("Compregister")}}>
        <Icon name="add" />
      </Fab>}
        </View>
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
        marginTop:25,
    },
    headerText:{
        fontSize:25,
        fontWeight:'bold',
        color:'#fff',
    },
  })