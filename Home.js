import React from 'react';
import { StyleSheet, BackHandler, AsyncStorage, Text, Alert, Linking, View, TouchableOpacity, StatusBar,Image, TouchableHighlight, ScrollView, Dimensions } from 'react-native';
import {Container, Content, Footer, Badge, FooterTab, Spinner, Button, Icon, Card, CardItem, Thumbnail, Left, Body, Right} from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import api from './DbConfig';

const {width, height} = Dimensions.get('window');
StatusBar.setBackgroundColor('#0099ff',true);


export default class Home extends React.Component {
    state = {
        loading: true
      }

    constructor(props) {  
        super(props);  
        this.state={
          caption:'TECH FEED',
          feedLoading:0,
          showfeed:[],
          workshop:0,
          components:0,
          userid:0,
          event:0,
          version:'1.2.0',
        };
    }

    _retrieveData = async () => {
      try{
        const useruid = await AsyncStorage.getItem('userid').then((value) => {
          this.checkUser().then(()=>{
            this.workshopdetail();
          });
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
        }
        else{
          this.props.navigation.replace("Login");
        }
      }
      catch(err){
        console.log('Profile Page store error: '+err);
      }
    }

    updateapp = (title,desc,link,active) => {
      if(active==1){
        Alert.alert(title, desc, [
          { text: "OK", onPress: () => Linking.openURL(link) }
        ]);
      }
      else{
        Alert.alert(title, desc, [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "OK", onPress: () => null, style: "cancel" }
        ]);
      }
      return true;
    };

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
      var InsertAPI = api+'allfeedhome.php';
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

    workshopdetail=()=>{
      var InsertAPI = api+'workshopnum.php';
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
        if(response[0].activeuser===0){
          this.props.navigation.replace("Logout");
        }
        else{
          this.setState({
            workshop:response[0].workshop,
            components:response[0].component,
            event:response[0].event,
          });
          if(response[0].info>0)
            if(response[0].version!=this.state.version)
              this.updateapp(response[0].title,response[0].desc,response[0].link,response[0].activatelink);
        }
      })
      .catch(err=>{
          alert('Something went wrong');
      })
    }
      
    
      async componentDidMount() {
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false })
        this._retrieveData();
        this.userfeed();
      }

  render() {
    if (this.state.loading) {
        return (
          <View></View>
        );
      }
    return (
      <Container>
        <Content>
          <View>
            <View style={styles.myHeader}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:30, color:'#fff', marginTop:20}}>ROBOGYAN</Text>
                <View>
                  <Image source={require('./assets/edugyan.png')} style={{marginLeft:width/4,height:100,width:100, resizeMode:'contain'}} />
                </View>
              </View>
            </View>  
            <View>
              <Image source={require('./assets/wave.png')} style={{resizeMode:'contain', marginTop:-1, height:(height/9)+5.5, width:width}} />
            </View>
              <View style={{alignItems:'center', padding:5, marginTop:-120}}>
         
                  <View style={styles.menuCard}>
                    {/* First menu line */}
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        
                        <View style={{alignItems:'center'}}>
                        <Button vertical transparent>
                        <View style={{backgroundColor:'#D6EBEC',height:65,width:65,alignItems:'center',justifyContent:'center',borderRadius:40,}}>
                            <TouchableHighlight activeOpacity={0.6} underlayColor="transperent" onPress={()=>{this.props.navigation.navigate("Course", {tag:'Arduino'})}}>
                            <Image source={require('./assets/iot.png')} style={{height:50,width:50, resizeMode:'contain'}} />
                            </TouchableHighlight>
                        </View>
                        <Text style={{marginTop:3, color:'#786D6D'}}>Arduino</Text>
                        </Button>
                        </View>
                        
                        <View style={{alignItems:'center', marginLeft:(width/4)-50}}>
                        <Button vertical transparent>
                        <View style={{backgroundColor:'#FFDCE4',height:65,width:65,alignItems:'center',justifyContent:'center',borderRadius:40,}}>
                            <TouchableHighlight activeOpacity={0.6} underlayColor="transperent" onPress={()=>{this.props.navigation.navigate("Course", {tag:'RaspberryPi'})}}>
                            <Image source={require('./assets/raspberry.png')} style={{height:50,width:50, resizeMode:'contain'}}/>
                            </TouchableHighlight> 
                        </View>
                            <Text style={{marginTop:3, color:'#786D6D'}}>Raspberry Pi</Text>
                        </Button>
                        </View>

                        <View style={{alignItems:'center', marginLeft:(width/4)-50}}>
                        <View style={{backgroundColor:'#BFEDEF',height:65,width:65,alignItems:'center',justifyContent:'center',borderRadius:40,}}>
                          <TouchableHighlight activeOpacity={0.6} underlayColor="transperent" onPress={()=>{this.props.navigation.navigate("Course", {tag:'Coding'})}}>
                              <Image source={require('./assets/web_icn.png')} style={{height:50,width:50, resizeMode:'contain'}}/>
                          </TouchableHighlight>
                        </View>
                        <Text style={{marginTop:3, color:'#786D6D'}}>Coding</Text>
                        </View>
                    </View>

                {/* Second menu line */}
                <View style={{flexDirection:'row', marginTop:20, alignItems:'center'}}>
                        <View style={{alignItems:'center'}}>
                        <View style={{backgroundColor:'#E3E3E3',height:65,width:65,alignItems:'center',justifyContent:'center',borderRadius:40,}}>
                        <TouchableHighlight activeOpacity={0.6} underlayColor="transperent" onPress={()=>{this.props.navigation.navigate("Course", {tag:'AeroTech'})}}>
                            <Image source={require('./assets/aero.png')} style={{height:50,width:50, resizeMode:'contain'}}/>
                        </TouchableHighlight>
                        </View>
                        <Text style={{marginTop:3, color:'#786D6D'}}>AeroTech</Text>
                        </View>
                        <View style={{alignItems:'center', marginLeft:(width/4)-50}}>
                        <View style={{backgroundColor:'#F8E0B1',height:65,width:65,alignItems:'center',justifyContent:'center',borderRadius:40,}}>
                        <TouchableHighlight activeOpacity={0.6} underlayColor="transperent" onPress={()=>{this.props.navigation.navigate("Clubcomponent")}}>
                            <Image source={require('./assets/project.png')} style={{height:50,width:50, resizeMode:'contain'}}/>
                        </TouchableHighlight>
                        </View>
                        {this.state.components===0?
                        <></>:<Badge style={{position:'absolute', backgroundColor:'red'}}><Text style={{color:'#fff'}}>0{this.state.components}</Text></Badge>}
                        <Text style={{marginTop:3, color:'#786D6D'}}>Components</Text>
                        </View>

                        <View style={{alignItems:'center', marginLeft:(width/4)-50}}>
                        <View style={{backgroundColor:'#CBE8FF',height:65,width:65,alignItems:'center',justifyContent:'center',borderRadius:40,}}>
                        <TouchableHighlight activeOpacity={0.6} underlayColor="transperent" onPress={()=>{this.props.navigation.navigate("Workshop")}}>
                            <Image source={require('./assets/inbox.png')} style={{height:50,width:50, resizeMode:'contain'}}/>
                        </TouchableHighlight>
                        </View>
                        {this.state.workshop===0?
                        <></>:<Badge style={{position:'absolute', backgroundColor:'red'}}><Text style={{color:'#fff'}}>0{this.state.workshop}</Text></Badge>}
                        <Text style={{marginTop:3, marginRight:5, color:'#786D6D'}}>Workshop</Text>
                        </View>
                    </View>

                {/* third menu line */}
                <View style={{flexDirection:'row', marginTop:20, alignItems:'center'}}>
                        <View style={{alignItems:'center'}}>
                        <View style={{backgroundColor:'#D6EAF1',height:65,width:65,alignItems:'center',justifyContent:'center',borderRadius:40,}}>
                        <TouchableHighlight activeOpacity={0.6} underlayColor="transperent" onPress={()=>{this.props.navigation.navigate("Membership")}}>
                            <Image source={require('./assets/man.png')} style={{height:50,width:50, resizeMode:'contain'}}/>
                          </TouchableHighlight>
                        </View>
                        <Text style={{marginTop:3, color:'#786D6D'}}>Membership</Text>
                        </View>
                        <View style={{alignItems:'center', marginLeft:(width/4)-50}}>
                        <View style={{backgroundColor:'#FFD9D4',height:65,width:65,alignItems:'center',justifyContent:'center',borderRadius:40,}}>
                          <TouchableHighlight activeOpacity={0.6} underlayColor="transperent" onPress={()=>{this.props.navigation.navigate("Event")}}>
                            <Image source={require('./assets/event.png')} style={{height:50,width:50, resizeMode:'contain'}}/>
                          </TouchableHighlight>
                        </View>
                        {this.state.workshop===0?
                        <></>:<Badge style={{position:'absolute', backgroundColor:'red'}}><Text style={{color:'#fff'}}>0{this.state.event}</Text></Badge>}
                        <Text style={{marginTop:3, color:'#786D6D'}}>Events</Text>
                        </View>

                        <View style={{alignItems:'center', marginLeft:(width/4)-50}}>
                        <View style={{backgroundColor:'#DAF4FF',height:65,width:65,alignItems:'center',justifyContent:'center',borderRadius:40,}}>
                        <TouchableHighlight activeOpacity={0.6} underlayColor="transperent" onPress={()=>{Linking.openURL('https://mail.google.com/mail/u/0/?view=cm&fs=1&to=edugyan100@gmail.com&su=Contact%20mail%20to%20RoboGYAN&tf=1')}}>
                            <Image source={require('./assets/team.png')} style={{height:50,width:50, resizeMode:'contain'}}/>
                        </TouchableHighlight>
                        </View>
                        <Text style={{marginTop:3, color:'#786D6D'}}>Help</Text>
                        </View>
                    </View>

                  </View>
              </View>
          </View>
        <View>
        <Text note style={{textAlign:'center', color:'#0099ff',fontSize:20, marginTop:20}}>
                    {this.state.caption}
                  </Text>
        </View>
          <View style={{padding:2}}>
          
            {this.state.feedLoading==0?
                      <View style={{padding:10, marginTop:20}}>
                        <Spinner color='#0099ff' />
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
                              <Text note style={{color:'#786D6D'}}>{item.tagname}</Text>
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
          </View>

          <View style={{alignSelf:'center',margin:10}}>
                <Button style={{padding:15, alignSelf:'center',borderRadius:25, backgroundColor:'#0099ff'}}
                onPress={()=>{this.props.navigation.navigate("Feed")}}>
                  <Text style={{color:'#fff'}}>Show All Feed</Text>
                </Button>
              </View>
        </Content>

        <Footer>
          <FooterTab style={{backgroundColor:'#fff'}}>
            <Button active  style={{backgroundColor:'#0099ff'}}>
              <Icon active name="home" />
            </Button>
            <Button onPress={()=>{this.props.navigation.navigate("Feed")}}>
              <Icon name="grid" />
            </Button>
            <Button onPress={()=>{this.props.navigation.navigate("Search")}}>
              <Icon name="search" />
            </Button>
            <Button>
              <Icon name="paper-plane"  onPress={()=>{this.props.navigation.navigate("Upload")}}/>
            </Button>
            <Button onPress={()=>{this.props.navigation.navigate("Profile")}}>
              <Icon name="person" />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  myHeader:{
    height:(height/3)+30,
    width:width,
    justifyContent:'center',
    backgroundColor:'#0099ff',
    padding:10,
  },
  menuCard:{
    height:height/2,
    width: width-40,
    backgroundColor: '#fff',
    borderRadius:15,
    marginTop:-15,
    shadowRadius:0.5,
    shadowColor:'#000',
    shadowOffset:{width:0.5,height:0.5},
    shadowOpacity:0.5,
    elevation:5,
    padding:15,
  },

  overlay: {
    position: 'absolute',
    opacity: 0.5,
    backgroundColor: 'black',
    width: 300,
    height:400,
  },
});
