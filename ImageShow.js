import React, { Component } from 'react';
import { Image, View, Dimensions, AsyncStorage, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Card,Header, Title, Footer, Icon, Spinner, FooterTab, CardItem, Thumbnail, Text, Button, Left, Body, Right, Item } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class ImageShow extends Component {
    state = {
        loading: true
      }

      constructor(props) {  
        super(props);  
        this.state={
          showImg:[],
          imglink:'',
          imgid:0,
          loadImg:0,
          userid:0,
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
          
          this.setState({userid:useruid});
        }
        else{
          this.setState({userid:0});
        }
      }
      catch(err){
        console.log('Profile Page store error: '+err);
      }
    }

    setImgid = ()=>{
        this.setState({imgid:this.props.route.params.id});
        this.showImage();
    }

    delete(postid){
      var InsertAPI = api+'deletepost.php';
        var Data={postid:postid};
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
            this.props.navigation.replace("Home");
          }
          else{
              console.log(response);
              this.props.navigation.replace("Home");
          }
        })
        .catch(err=>{
            console.log(err);
            this.props.navigation.replace("Home");
        })
    }


    showImage=()=>{
        var InsertAPI = api+'showimg.php';
        var Data={imgid:this.state.imgid};
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
            this.setState({loadImg:1});
            this.props.navigation.goBack();
          }
          else{
              this.setState({showImg:response});
              this.setState({imglink:this.state.showImg[0].image});
              this.setState({loadImg:1});
          }
        })
        .catch(err=>{
            alert('Something went wrong');
            this.setState({loadImg:1});
            this.props.navigation.goBack();
        })
      }
    
      async componentDidMount() {
          this._retrieveData();
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false });
        this.setImgid();
      }


  render() {
    if (this.state.loading) {
        return (
          <View></View>
        );
      }
    return (
    <Container>

<Header style={{backgroundColor:'#000'}} androidStatusBarColor='#0099ff'>
               <Left>
                  <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
                    <Icon name='arrow-back' />
                  </Button>
                </Left>
                  <Body>
                  </Body>
                  <Right />
                </Header>
                
              <Content style={{backgroundColor:'black'}}>
              {this.state.loadImg==0?
              <View style={{marginTop:height/3}}>
                  <Spinner color='#0099ff' />
              </View>:<View>
                    <View style={{marginTop:10, flexDirection:'row'}}>
                        <Left><Text style={{color:'white', margin:10, fontSize:22, marginTop:50}}>{this.state.showImg[0].title}</Text></Left>
                        {this.state.userid==this.state.showImg[0].uid?
                        <Right>
                          <TouchableOpacity onPress={()=>{this.delete(this.state.showImg[0].id)}}>
                            <Icon name="trash" style={{margin:10,color:'red'}}/>
                          </TouchableOpacity>
                        </Right>:<View/>}
                    </View>
                        <View style={{marginTop:25, alignItems:'center', padding:10}}>
                            <Thumbnail large
                            source={{uri:this.state.imglink}} style={{height:height/2, width:width-20, borderRadius:0}}/>
                        </View>
                        <View>
                            <Text style={{color:'white', margin:20, fontSize:15, marginTop:50}}>{this.state.showImg[0].details}</Text>
                        </View>
                   </View>}
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
      marginTop:25,
  },
  headerText:{
      fontSize:25,
      fontWeight:'bold',
      color:'#fff',
  },
})