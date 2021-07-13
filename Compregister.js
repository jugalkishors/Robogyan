import React, { Component } from 'react';
import { Image, View, Dimensions, AsyncStorage,  StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Card, Header, Title, Footer, Textarea, Spinner, Item, Input, Picker, Icon, FooterTab, CardItem, Thumbnail, Text, Button, Left, Body, Right } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Upload extends Component {
    state = {
        loading: true
      }

      constructor(props) {  
        super(props);  
        this.state = {
          userid:0,
          btnsnipper:0,
          selected2: '',
          options:[],
          selected3: '',
          options3:[],
          qnty:0,
          qntyWarn:'',
          comp:'',
          compWarn:'',
          btnStatus:true,
        };
    }

    onValueChange2(value) {
      this.setState({
        selected2: value,
        comp:value,
      });
      this.compqty(value);
    }

    onValueChange3(value) {
      this.setState({
        selected3: value,
        qnty:value,
        btnStatus:false,
      });
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

            this.setState({userid:useruid});
            this.allcomponents();
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
      }


      allcomponents=()=>{
        var InsertAPI = api+'complist.php';
        var Data={};
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
            //this.setState({caption:'No feed to show'});
            //this.setState({btnsnipper:0});
          }
          else{
            this.setState({options:response});
            //this.setState({btnsnipper:0});
          }
        })
        .catch(err=>{
            console.log(err);
            alert('Something went wrong');
            //this.setState({feedLoading:0});
        })
      }
      compqty=(val)=>{
        var InsertAPI = api+'compqty.php';
        var Data={comp:val};
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
            //this.setState({caption:'No feed to show'});
            //this.setState({btnsnipper:0});
          }
          else{
            //console.log(response.map(String));
            this.setState({options3:response.map(String)});
            //this.setState({btnsnipper:0});
          }
        })
        .catch(err=>{
            console.log(err);
            alert('Something went wrong');
            //this.setState({feedLoading:0});
        })
      }


      verify=()=>{
        if (this.state.qnty<1) {
            this.setState({compWarn:''});
            this.setState({qntyWarn:'Please enter quantity!'});
        }
        else if (this.state.comp<1) {
            this.setState({qntyWarn:''});
            this.setState({compWarn:'Please enter component name!'});
        }
        else{
            this.setState({compWarn:''});
            this.setState({qntyWarn:''});
            this.setState({btnsnipper:1});
            this.addcomponent();
        }
      }

      addcomponent=()=>{
        var InsertAPI = api+'addcomponent.php';
        var Data={uid:this.state.userid, name:this.state.comp, qty:this.state.qnty};
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
              this.props.navigation.replace("Home");
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
                    <Title>ADD</Title>
                  </Body>
                  <Right />
                </Header>
                
              <Content>

              
              <View style={{marginTop:20, margin:15}}>

            <View>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Select Component"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}
                >
                  <Picker.Item label='Select Component' value='' key='Select Component'/>
                {this.state.options.map((item, index) => {
                  return (<Picker.Item label={item} value={item} key={item}/>) 
              })}
              </Picker>
            </Item>
            <Text style={{color:'red'}}>{this.state.compWarn}</Text>  
            </View>
            

            {/* For component quantity */}
            <View>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Select Quantity"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected3}
                onValueChange={this.onValueChange3.bind(this)}
                >
                  <Picker.Item label='Select Quantity' value='' key='Select Quantity'/>
                {this.state.options3.map((item, index) => {
                  return (<Picker.Item label={item} value={index+1} key={index}/>) 
              })}
              </Picker>
            </Item>
            <Text style={{color:'red'}}>{this.state.qntyWarn}</Text>
            </View>

                <View style={{alignSelf:'center'}}>
                      <Button block info disabled={this.state.btnStatus}  style={{marginTop:50, borderRadius:45, width:150}} onPress={()=>this.verify()}>
                      {this.state.btnsnipper==0?
                        <Text>ADD</Text>:<Spinner color='white' />}
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
            <Button active  style={{backgroundColor:'#0099ff'}}>
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