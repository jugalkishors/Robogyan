import React, { Component } from "react";
import { Image, keyboard, Modal, LogBox, AsyncStorage, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Header, Title, FooterTab, Footer, Spinner, Textarea, Content, Card, CardItem, Text, Body, View, Fab, Left, Right, Button, Icon, List, ListItem, Thumbnail, Item } from "native-base";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

LogBox.ignoreAllLogs();

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class DissSolve extends Component {
    constructor(props) {
        super(props)
        this.state = {
          active: false,
          userid:0,
          username:'',
          userimg:api+'uploads/man.png',
          tagname:'',
          ques:'',
          dissid:0,
          modalVisible:false,
          answer:'',
          answerWarn:'',
          showfeed:[],
          btnsnipper:0,
          cuid:0,
          cusername:'',
          cuserimg:api+'uploads/man.png',
          ctagname:'',
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
            
            this.setState({cuid:useruid});
            this.setState({cusername:nameuser});
            this.setState({ctagname:designuser});
            this.setState({cuserimg:imguser});
          }
          else{
            this.props.navigation.replace("Login");
          }
        }
        catch(err){
          console.log('Profile Page store error: '+err);
        }
      }

      setData = async ()=>{
        this.setState({
            userid:this.props.route.params.userid,
            username:this.props.route.params.username,
            tagname:this.props.route.params.tagname,
            userimg:this.props.route.params.userimg,
            ques:this.props.route.params.ques,
            dissid:this.props.route.params.dissid,
          });
      }

      allanswerslist=()=>{
        var InsertAPI = api+'allanswers.php';
        var Data={dissid:this.state.dissid};
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
            this.setState({btnsnipper:0});
          }
          else{
            this.setState({showfeed:response});
            this.setState({btnsnipper:0});
          }
        })
        .catch(err=>{
            alert('Something went wrong');
            this.setState({btnsnipper:0});
        })
      }

      closeModal=()=>{
          this.setState({modalVisible:false});
          this.props.navigation.goBack();
      }

      verify=()=>{
        if(this.state.answer.length<4){
            this.setState({answerWarn:''});
            this.setState({answerWarn:'Please enter some text!'});
        }
        else{
            this.setState({answerWarn:''});
            this.setState({btnsnipper:1});
            this.sendAnswer();
        }
    }

    sendAnswer=()=>{
        var InsertAPI = api+'answers.php';
        var Data={uid:this.state.cuid, username:this.state.cusername, userimg:this.state.cuserimg, tagname:this.state.ctagname, answer:this.state.answer, dissid:this.state.dissid};
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
               this.setState({btnsnipper:0});
               this.setState({modalVisible:true});
               setTimeout(this.closeModal,3000);
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


      async componentDidMount() {
          this._retrieveData();
        await this.setData().then(()=>{
            this.allanswerslist();
        });
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
                <Title>Disscussion</Title>
            </Body>
            <Right />
        </Header>
        <Content>
        <View>
            <View style={{padding:15}}>
                <Text>Problem Statment</Text>
                <Text style={{fontSize:32, color:'#0099ff'}}>{this.state.ques}</Text>

                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Userprofile",{userid:this.state.userid, username:this.state.username, userimg:this.state.userimg, usertag:this.state.tagname})}}>
                    <View style={{flexDirection:'row', marginTop:15}}>
                        <View style={{flexDirection:'column'}}>
                            <Thumbnail rounded source={{uri:this.state.userimg}}
                            style={{height:40, width:40}}
                            />
                        </View>
                        <View style={{flexDirection:'column', justifyContent:'center', marginLeft:5}}>
                            <Text>{this.state.username}</Text>
                            <Text note style={{fontSize:10, marginLeft:5}}>{this.state.tagname}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{padding:15, marginTop:20}}>
                <Text style={{color:'#0099ff'}}>Solutions</Text>
            </View>

            <View style={{alignItems:'center'}}>
                <View style={{flexDirection:'row'}}>
                <View style={{flexDirection:'column'}}>
                <Textarea placeholder="how we solve it ..."
                    maxLength={600}
                    rowSpan={2}
                    bordered
                    value={this.state.designation}
                    style={{width:(width/2)+90, borderRadius:5}}
                    onChangeText={(answer) => this.setState({answer})}/>
                
                <Text style={{color:'red', marginLeft:2}}>{this.state.answerWarn}</Text>
                </View>
                
                <View style={{flexDirection:'column', marginTop:8, marginLeft:10}}>
                    <Button style={{backgroundColor:'#0099ff'}} onPress={()=>{this.verify()}}>
                    {this.state.btnsnipper==0?
                        <Icon name="send"/>:<Spinner color='white' />}
                        </Button>
                </View>
            </View>

            </View>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    >
                    <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                            <Thumbnail source={require('./assets/success.gif')}
                            style={{height:height/4,width:width, resizeMode:'contain'}}
                            />
                                <Text note style={{fontSize:20}}>Solution Added</Text>
                            </View>
                    </View>
                </Modal>
            </View>
            </View>
            
            {this.state.btnsnipper==0?
                  <View>
                {this.state.showfeed==null?
                  <Text style={{textAlign:'center', marginTop:50}}>No Discussion found !</Text>:<List  dataArray={this.state.showfeed} renderRow={(item) =>
                    <ListItem thumbnail>
                      
                      <Body>
                        <Text>{item.answer}</Text>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Userprofile",{userid:item.uid, username:item.username, userimg:item.userimg, usertag:item.tagname})}}>
                            <View>
                            <Text note style={{fontSize:15}}>{item.username}</Text>
                            <Text note style={{fontSize:10, marginLeft:5}}>{item.tagname}</Text>
                            </View>
                        </TouchableOpacity>
                      </Body>
                      
                  </ListItem>}/>}
                  </View>:<Thumbnail source={require('./assets/faq.gif')}
                          style={{height:height/3,width:width, resizeMode:'contain'}}
            />}
            </Content>
            
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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
  });