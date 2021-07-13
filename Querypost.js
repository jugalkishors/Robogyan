import React, { Component } from 'react';
import { Image,  TouchableHighlight, Modal, AsyncStorage, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Text, Spinner, Textarea, Header, View, Button, Icon, Fab, Tab, Tabs, ScrollableTab, Left, Right, Body, Title, Subtitle, Thumbnail } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';


StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");
export default class Querypost extends Component {
    constructor(props) {
        super(props)
        this.state = {
          btnsnipper:0,
          useruid:0,
          username:'',
          tagname:'',
          userimg:'',
          querytxt:'',
          queryWarn:'',
          tag:'Course',
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
            
            this.setState({useruid:useruid});
            this.setState({username:nameuser});
            this.setState({tagname:designuser});
            this.setState({userimg:imguser});
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
        this.setState({tag:this.props.route.params.tag});
        this._retrieveData();
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false })
      }


      verify=()=>{
        if(this.state.querytxt.length<4){
            this.setState({queryWarn:''});
            this.setState({queryWarn:'Please enter some text!'});
        }
        else{
            this.setState({queryWarn:''});
            this.setState({btnsnipper:1});
            this.sendQuery();
        }
    }

    sendQuery=()=>{
        var InsertAPI = api+'disscussion.php';
        var Data={uid:this.state.useruid, username:this.state.username, userimg:this.state.userimg, tagname:this.state.tagname, question:this.state.querytxt, cat:this.state.tag};
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
              this.props.navigation.goBack();
              this.setState({btnsnipper:0});
            }
            else{
              alert('Something went wrong');
              this.setState({btnsnipper:0});
            }
        })
        .catch(err=>{
            console.log(err);
            this.setState({btnsnipper:0});
        })
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
            <Title>Post Your Query</Title>
          </Body>
          <Right />
        </Header>
        <View style={{alignItems:'center', marginTop:20}}>
          <Thumbnail
            source={require('./assets/thinkingboy.gif')}
            style={{height:130,width:width, borderRadius:65}}
          />

            <View style={{marginTop:20, height:height}}>
              <Text note style={{fontSize:20}}>Let's solve it with more brains</Text>
              <Textarea placeholder="Share your query with world..."
                maxLength={600}
                rowSpan={5}
                bordered
                value={this.state.designation}
                style={{width:width-20, borderRadius:5}}
                onChangeText={(querytxt) => this.setState({querytxt})}/>
              
              <Text style={{color:'red', marginLeft:2}}>{this.state.queryWarn}</Text>

            <Button block info  style={{marginTop:20, margin:20}} onPress={()=>this.verify()}>
              {this.state.btnsnipper==0?
              <Text>Share</Text>:<Spinner color='white' />}
            </Button>
            </View>
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
    },
    headerText:{
        fontSize:25,
        fontWeight:'bold',
        color:'#fff',
    },


    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      width:(width/2)+50,
      justifyContent:'center',
      height:height/3,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  })