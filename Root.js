import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import Home from './Home';
import Feed from './Feed';
import Search from './Search';
import Upload from './Upload';
import Profile from './Profile';
import Editprofile from './Editprofile';
import Logout from './Logout';
import Login from './Login';
import Register from './Register';
import Forgetpass from './Forgetpass';
import Otp from './Otp';
import Changepass from './Changepass';
import Userprofile from './Userprofile';
import ImageShow from './ImageShow';
import Comments from './Comments';
import Projects from './Projects';
import Issues from './Issues';
import Course from './Course';
import Querypost from './Querypost';
import DissSolve from './DissSolve';
import Clubcomponent from './Clubcomponent';
import Membership from './Membership';
import Projectview from './Projectview';
import Workshop from './Workshop';
import Workshopdesc from './Workshopdesc';
import Payment from './Payment';
import Compregister from './Compregister';
import Event from './Event';
import Help from './Help';


//import SearchLogicTest from './SearchLogicTest';

function Root() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown:false}}>
            <Stack.Screen name="Home"
            component={Home} />
            <Stack.Screen name="Feed" component={Feed} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Upload" component={Upload} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Editprofile" component={Editprofile} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Forgetpass" component={Forgetpass} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Changepass" component={Changepass} />
            <Stack.Screen name="ImageShow" component={ImageShow} />
            <Stack.Screen name="Comments" component={Comments} />
            <Stack.Screen name="Userprofile" component={Userprofile} />
            <Stack.Screen name="Course" component={Course} />
            <Stack.Screen name="Issues" component={Issues} />
            <Stack.Screen name="Projects" component={Projects} />
            <Stack.Screen name="Querypost" component={Querypost} />
            <Stack.Screen name="DissSolve" component={DissSolve} />
            <Stack.Screen name="Clubcomponent" component={Clubcomponent} />
            <Stack.Screen name="Membership" component={Membership} />
            <Stack.Screen name="Projectview" component={Projectview} />
            <Stack.Screen name="Workshop" component={Workshop} />
            <Stack.Screen name="Workshopdesc" component={Workshopdesc} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="Compregister" component={Compregister} />
            <Stack.Screen name="Event" component={Event} />
            <Stack.Screen name="Help" component={Help} />
            {/* <Stack.Screen name="SearchLogicTest" component={SearchLogicTest} /> */}
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Root;