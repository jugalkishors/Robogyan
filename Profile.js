import React, { Component, Profiler } from 'react';
import { Image, View, AsyncStorage,BackHandler, Linking, LogBox, Dimensions, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Card, Footer, Spinner, Icon, FooterTab, CardItem, DeckSwiper, Thumbnail, Text, Button, Left, Body, Right } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet';
import api from './DbConfig';

LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`']);
LogBox.ignoreLogs(['Animated: `componentWillReceiveProps has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.`']);

StatusBar.setBackgroundColor('#0099ff',true);
const {width, height} = Dimensions.get("window");

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 3
const options = [ 'Cancel', 'Edit Profile', 'Change Password', 'Logout' ]

export default class Feed extends Component {

  constructor(props) {  
        super(props);  
        this.state={
          userimg:'https://www.w3schools.com/howto/img_avatar.png',
          username:'Username',
          userdesig:'Tech Creator',
          useremailid:'',
          userid:0,
          caption:'YOUR FEED',
          feedLoading:0,
          showfeed:[],
          instagram:null,
          facebook:null,
          linkedin:null,
          github:null,
          showingtabs:[],
          tabloader:true,
        };
    }

    state = {
        loading: true,
        selected: '',
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
            const designuser = await AsyncStorage.getItem('tagname');
            const imguser = await AsyncStorage.getItem('image');
            const mailuser = await AsyncStorage.getItem('email');
            const insta = await AsyncStorage.getItem('instagram');
            const fb = await AsyncStorage.getItem('facebook');
            const linkd = await AsyncStorage.getItem('linkedin');
            const git = await AsyncStorage.getItem('github');
            
            this.setState({userid:useruid});
            this.setState({username:nameuser});
            this.setState({userdesig:designuser});
            this.setState({userimg:imguser});
            this.setState({useremailid:mailuser});
            this.setState({instagram:insta});
            this.setState({facebook:fb});
            this.setState({linkedin:linkd});
            this.setState({github:git});
            this.profiletabs();
            this.workshopdetail();
            this.userfeed();
          }
          else{
            this.props.navigation.replace("Login");
          }
        }
        catch(err){
          console.log('Profile Page store error: '+err);
        }
      }


      userfeed=()=>{
        var InsertAPI = api+'profilefeed.php';
        var Data={userid:this.state.userid};
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

      profiletabs=()=>{
        var InsertAPI = api+'profiletabs.php';
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
          this.setState({showingtabs:response[0]});
          this.setState({tabloader:false});
        })
        .catch(err=>{
          console.log(err);
          this.setState({tabloader:false});
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
        })
        .catch(err=>{
            alert('Something went wrong');
        })
      }


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

      async componentDidMount() {
        this._retrieveData();
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        })
        this.setState({ loading: false })
      }

      changePassword = () => {
          alert('Change Password');
      }

      showActionSheet = () => {
        this.ActionSheet.show();
      }
    
      handlePress = (buttonIndex) => {
        if(buttonIndex===1){
          this.props.navigation.navigate("Editprofile");
        }
        else if(buttonIndex===2){
          this.props.navigation.navigate("Changepass");
        }
        else if(buttonIndex===3){
          this.props.navigation.replace("Logout")
        }
        else{
          //cancel button
        }
        this.setState({ selected: buttonIndex })
      }

  render() {
    if (this.state.loading) {
        return (
          <View></View>
        );
      }
    return (
    <Container>
      
               {/* <View style={styles.myHeader}>
                  <Text style={styles.headerText}>Profile</Text>
                </View> */}

                <View>
                  <Image
                    source={require('./assets/bgprofile.png')}
                    style={{width:width, height:height/3}}
                  />
                </View>
                
                  <View style={styles.profileimg}>
                    <Thumbnail
                    source={{uri:this.state.userimg}}
                    style={{height:130,width:130, borderRadius:65}}
                    />
                  </View>
                  <Content>
                  <View>
                  <View style={{margin:10, marginTop:15, flexDirection:'row'}}>
                    <Left>
                      <View>
                        <Text style={{fontSize:28, color:'#0099ff'}}>{this.state.username}</Text>
                        <Text note style={{fontSize:18, marginLeft:3, color:'#6F6F6F'}}>{this.state.userdesig}</Text>
                      </View>
                    </Left>
                    <Right>
                      <View>
                        <TouchableOpacity  onPress={this.showActionSheet}>
                          <View style={styles.editBtn}>
                            <Icon name="add" style={{color:'#fff'}}/>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </Right>
                  </View>

                  <View style={{marginLeft:5, padding:5, flexDirection:'row'}}>
                  {this.state.instagram==null?
                    <></>:<TouchableOpacity onPress={()=>{Linking.openURL('https://instagram.com/'+this.state.instagram)}}>
                      <View>
                        <Thumbnail square source={require('./assets/insta.png')} style={{height:25, resizeMode:'contain'}}/>
                      </View>
                    </TouchableOpacity>}

                    {this.state.facebook==null?
                    <></>:<TouchableOpacity onPress={()=>{Linking.openURL('https://www.facebook.com/'+this.state.facebook)}}>
                      <View>
                        <Thumbnail square source={require('./assets/fb.png')} style={{height:25, resizeMode:'contain'}}/>
                      </View>
                    </TouchableOpacity>}

                    {this.state.linkedin==null?
                    <></>:<TouchableOpacity onPress={()=>{Linking.openURL('https://www.linkedin.com/in/'+this.state.linkedin)}}>
                      <View>
                        <Thumbnail square source={require('./assets/linkedin.png')} style={{height:25, resizeMode:'contain'}}/>
                      </View>
                    </TouchableOpacity>}

                    {this.state.github==null?
                    <></>:<TouchableOpacity onPress={()=>{Linking.openURL('https://github.com/'+this.state.github)}}>
                      <View>
                        <Thumbnail square source={require('./assets/github.png')} style={{height:25, resizeMode:'contain'}}/>
                      </View>
                    </TouchableOpacity>}
                    
                  </View>

                  <View style={{height:(height/6)+5,alignItems:'center'}}>
                    <View style={styles.profileData}>
                      <Left>
                        <View style={{alignItems:'center'}}>
                          <Icon name="images" style={{color:'#6F6F6F'}}/>
                          {this.state.tabloader==true?
                          <Text style={{fontSize:30}}>-</Text>:<Text style={{fontSize:30}}>{this.state.showingtabs.post}</Text>}
                          <Text note>Posts</Text>
                        </View>
                      </Left>
                      <View style={{alignItems:'center'}}>
                          <Icon name="people" style={{color:'#6F6F6F'}}/>
                          {this.state.tabloader==true?
                          <Text style={{fontSize:30}}>-</Text>:<>
                          {this.state.showingtabs.membership==0?
                          <Text style={{fontSize:20,padding:5}}>Regular</Text>:<Text style={{fontSize:20, color:'#0099ff',padding:5}}>Premium</Text>}
                          </>}
                          <Text note>Membership</Text>
                        </View>
                      
                      <Right>
                      <View style={{justifyContent:'center', alignItems:'center'}}>
                          <Icon name="pencil" style={{color:'#6F6F6F'}}/>
                          {this.state.tabloader==true?
                          <Text style={{fontSize:30}}>-</Text>:<Text style={{fontSize:30}}>{this.state.showingtabs.solution}</Text>}
                          <Text note>Solutions</Text>
                      </View>
                      </Right>
                    </View>
                  </View>
                </View>
                
                <View>
                  <ActionSheet
                    ref={o => { this.ActionSheet = o }}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress}
                  />
                </View>

                <View>
                  <Text note style={{textAlign:'center', color:'#0099ff',fontSize:20, marginTop:20}}>
                    {this.state.caption}
                  </Text>
                </View>

                {this.state.feedLoading==0?
                <View style={{padding:10, marginTop:20}}>
                  <Spinner color='#0099ff' />
                </View>:<View style={{padding:10, marginTop:20}}>
                {this.state.showfeed.map((item, index) => {
                 return(
                  <Card>
                    <CardItem>
                    <Left>
                        <Thumbnail source={{uri: this.state.userimg}} />
                        <Body>
                        <Text>{this.state.username}</Text>
                        <Text note>{this.state.userdesig}</Text>
                        </Body>
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
              <Icon name="paper-plane" />
            </Button>
            <Button active  style={{backgroundColor:'#0099ff'}}>
              <Icon active name="person" />
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
  profileimg:{
    alignSelf:'center',
    marginTop:-80,
    borderWidth: 8,
    borderRadius:80,
    borderColor:'rgba(254, 254, 254, 0.5)',
  },
  editBtn:{
    height:60,
    width:60,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#0099FF',
    borderRadius:35,
    shadowRadius:0.5,
    shadowColor:'#000',
    shadowOffset:{width:0.5,height:0.5},
    shadowOpacity:0.5,
    elevation:5,
  },

  profileData:{
    height:height/6,
    width: width-20,
    backgroundColor: '#fff',
    borderRadius:15,
    shadowRadius:0.5,
    shadowColor:'#000',
    shadowOffset:{width:0.2,height:0.2},
    shadowOpacity:0.8,
    elevation:2,
    padding:15,
    justifyContent:'center',
    flexDirection:'row',
  },
})