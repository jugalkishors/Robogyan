import React, { Component } from 'react';
import { Image, keyboard, AsyncStorage, Linking, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Text, Header, View, Button, Icon, Fab, Tab, Tabs, ScrollableTab, Left, Right, Body, Title, Subtitle } from 'native-base';
import Tab1 from './Projects';
import Tab2 from './Issues';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

export default class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
          active: false,
          tag:'Course',
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
         await this.setState({tag:this.props.route.params.tag});

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
            <Title>{this.state.tag}</Title>
          </Body>
          <Right />
        </Header>
        <Tabs renderTabBar={()=> <ScrollableTab />}>
          <Tab heading="PROJECTS" tabStyle={{ backgroundColor: "#0099ff"}} activeTabStyle={{ backgroundColor: "#0099ff", flex:2}}>
            <Tab1 tag={this.props.route.params.tag} navigation={this.props.navigation}/>
          </Tab>
          <Tab heading="DISSCUSSIONS" tabStyle={{ backgroundColor: "#0099ff"}} activeTabStyle={{ backgroundColor: "#0099ff", flex:2 }}>
            <Tab2 tag={this.props.route.params.tag} navigation={this.props.navigation}/>
          </Tab>
        </Tabs>
        
        <View>
        <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: '#0099ff' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="add" />
            <Button style={{ backgroundColor: '#34A34F' }} onPress={()=>{this.props.navigation.navigate("Querypost",{tag:this.state.tag})}}>
              <Icon name="query" />
            </Button>
            <Button style={{ backgroundColor: '#DD5144' }}  onPress={()=>{Linking.openURL('https://mandawamart.com/roboclub/web/index.php')}}>
              <Icon name="book" />
            </Button>
          </Fab>
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