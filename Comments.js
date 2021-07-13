import React, { Component } from 'react';
import { Image, View, Dimensions, AsyncStorage, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Card, Header, Title, Spinner,List, ListItem, Footer,Textarea, Input, Icon, FooterTab, CardItem, Thumbnail, Text, Button, Left, Body, Right, Item } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Comments extends Component {
    state = {
        loading: true
      }

      constructor(props) {  
        super(props);  
        this.state={
          pid:0,
          comment:'',
          comWarn:'',
          tagname:'Tech Creator',
          btnsnipper:0,
          userid:'',userimg:'',username:'',
          showComment:[],
          commentSpinner:0,

        };
    }

    _retrieveData = async () => {
        try{
        const useruid = await AsyncStorage.getItem('mail').then((value) => {
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
            const imguser = await AsyncStorage.getItem('image');
            const tagname = await AsyncStorage.getItem('tagname');
            
            this.setState({userid:useruid});
            this.setState({username:nameuser});
            this.setState({userimg:imguser});
            this.setState({tagname:tagname});
            this.setState({pid:this.props.route.params.pid});
            this.showallComments();

          }
          else{
            this.props.navigation.replace("Login");
          }
        }
        catch(err){
          console.log('Profile Page store error: '+err);
        }
      }


    verify = ()=>{
        if(this.state.comment===''){
            this.setState({comWarn:'Write comment!'});
        }
        else{
            this.setState({comWarn:''});
            this.setState({btnsnipper:1});
            this.postcomment();
        }
    }

    delcomment(comid){
      var InsertAPI = api+'deletecomment.php';
        var Data={id:comid};
        var headers={
        'Accept':'application/json',
        'Content-Type':'application.json'
        }
        fetch(InsertAPI,{
            method:'POST',
            headers:headers,
            body:JSON.stringify(Data),
        }).then((response)=>response.json()).then((response)=>{
          if(response==='True'){
            this.props.navigation.replace("Comments",{pid:this.state.pid});
          }
          else{
              console.log(response);
          }
        })
        .catch(err=>{
            console.log(err);
            //this.props.navigation.replace("Home");
        })
    }

    showallComments=()=>{
      this.setState({commentSpinner:1});
      var InsertAPI = api+'allcomments.php';
      var Data={pid:this.state.pid};
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
          this.setState({commentSpinner:0});
        }
        else{
          this.setState({showComment:response});
          this.setState({commentSpinner:0});
        }
      })
      .catch(err=>{
        console.log(err);
          alert('Something went wrong');
          this.setState({commentSpinner:0});
      })
    }

    postcomment=()=>{
        var InsertAPI = api+'comments.php';
        var Data={pid:this.state.pid,tagname:this.state.tagname,uid:this.state.userid,name:this.state.username,img:this.state.userimg,comment:this.state.comment};
        var headers={
        'Accept':'application/json',
        'Content-Type':'application.json'
        }
        fetch(InsertAPI,{
            method:'POST',
            headers:headers,
            body:JSON.stringify(Data),
        }).then((response)=>response.json()).then((response)=>{
            if(response==='True'){
                this.setState({btnsnipper:0});
                this.props.navigation.goBack();
            }
            
            else{
                alert('Something went Wrong!!!');
                this.setState({btnsnipper:0});
                this.props.navigation.goBack();
            }
            
        })
        .catch(err=>{
            alert('Something went Wrong!!!');
            this.setState({btnsnipper:0});
            this.props.navigation.goBack();
        })
    }
    
      async componentDidMount() {
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false });
        this._retrieveData();
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
                    <Title>FAQs</Title>
                  </Body>
                  <Right />
                </Header>
                <View>
                  {this.state.commentSpinner==0?
                    <View>
                  {this.state.showComment==null?
                    <Text style={{textAlign:'center', marginTop:50}}>User not found !</Text>:<List  dataArray={this.state.showComment} renderRow={(item) =>
                      <ListItem thumbnail>
                        <Left>
                          <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Userprofile",{userid:item.uid,username:item.username,usertag:item.tagname,userimg:item.image})}}>
                            <Thumbnail rounded source={{uri:item.image}} />
                          </TouchableOpacity>
                        </Left>
                        <Body>
                          <Text>{item.username}</Text>
                          <Text note numberOfLines={3}>{item.text}</Text>
                        </Body>
                        {this.state.userid==item.uid?
                        <Right>
                          <TouchableOpacity onPress={()=>{this.delcomment(item.id)}}>
                            <Icon name="trash"/>
                          </TouchableOpacity>
                        </Right>:<View/>}
                        
                  </ListItem>}/>}
                  </View>:<Spinner color='#0099ff' />}
                </View>
                
              <Content>
                

              </Content>


            <View style={{flexDirection:'row'}}>
                <View style={{flexDirection:'column',margin:15, justifyContent:'center'}}>
                    <Item style={{width:(width/2)+40}}>
                        <Textarea placeholder='Write comment...'
                        rowSpan={1}
                        maxLength={100}
                        onChangeText={(comment) => this.setState({comment})}/>
                    </Item>
                    <Text style={{color:'red', marginLeft:5}}>{this.state.comWarn}</Text>
                </View>
                <View style={{flexDirection:'column', justifyContent:'center'}}>
                    <Button block info 
                        onPress={()=>{this.verify()}}
                        style={{width:100, borderRadius:30}}>
                            {this.state.btnsnipper==0?
                                <Text>Send</Text>:<Spinner color='white' />}
                    </Button>
                </View>
            </View>

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