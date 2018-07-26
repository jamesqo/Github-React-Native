/*
 * @format
 * @flow


Display name of current directory in the header -> edit that
Navigate far up the stack -> put a drop down element, build from the array, and push that many pages back
 */
 

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Alert, FlatList, Button} from 'react-native';
import { Card } from 'react-native-elements'
import { createStackNavigator } from 'react-navigation';


type Props = {};

export default class App extends React.Component {

  render() {
    return <MyNavigator />;
  }
}



async function callAPI(r, o, p) {

  console.log(formatURL(r,o,p))
  try {
    let response = await fetch(
      formatURL(r,o,p)
    );
    let responseJson = await response.json();
    return formatJSON(responseJson)
  } catch (error) {
    console.error(error);
  }
}

function formatJSON(f){
  let l = []
    for (var i = 0; i < f.length; i++) {
      let objectToStore = {name: f[i].name, type: f[i].type};
      l.push(objectToStore)
    }
    //console.log("LOOK HERE---------------------");
    //console.log(l);
    //console.log("------------------------------");
    return l;
}

function formatURL(r,o,p){
  let baseURL = 'https://api.github.com/repos/'+o+'/'+r+'/contents'
  if (p.length == 1){
    return baseURL;
  }
  else{
    for (var i = 1; i < p.length; i++) {
      baseURL = baseURL.concat(p[i]);
    }  
    return baseURL;  
  }
}



class sr extends React.Component {
  static navigationOptions = {
    headerTitle: 'Search'
  }

  constructor(props){
      super(props);
      this.state = {
        owner: 'mrericl',
        repo: 'GET',
        path: [''],

      };
    }

  render() {
    const { push } = this.props.navigation;
    return (
        <View style={styles.container}>
        <Text style={styles.welcome}>Git Nav{"\n"}</Text>
        <TextInput
          style={{height: 20, borderColor: 'black', borderWidth: 1, width:200}}
          onChangeText={(repo) => this.setState({repo})}
          value={this.state.repo}
        />
        <TextInput
          style={{height: 20, borderColor: 'black', borderWidth: 1, width:200}}
          onChangeText={(owner) => this.setState({owner})}
          value={this.state.owner}
        />
        <Button
          title="Find files"
          onPress = {() => push('Directory', {sentrepo: this.state.repo, sentown: this.state.owner,sentpath: this.state.path})
              //data:callAPI()})
          //this.props.navigation.navigate('Directory')
        }
        />
      </View>
    );
  }
}

class dir extends React.Component {

  static navigationOptions = {
    headerTitle: 'Directory'
  }
  componentDidMount(){
      let sentrepo = this.props.navigation.state.params.sentrepo;
      let sentown = this.props.navigation.state.params.sentown;
      let sentpath = this.props.navigation.state.params.sentpath;
      callAPI(sentrepo, sentown, sentpath).
        then((ar) => { 
          this.setState({data: ar})
        })
  }
  constructor(props){
      super(props);
      this.state = {
        data: ['test']
      };
    }


// two on item press, if its not a directory, make it render the base64
  onItemPress(item) {
    const { push } = this.props.navigation;
    let repo = this.props.navigation.state.params.sentrepo;
    let own = this.props.navigation.state.params.sentown;
    let path = this.props.navigation.state.params.sentpath;
    if (item.type == 'dir'){
      path = path.slice()
      path.push(item.name)
      push('Directory', {sentrepo: repo, sentown: own, sentpath: path})
    }
  }

  render() {
    

    return (

        <View style={styles.dirstyle}>

        <FlatList
          data = {this.state.data}
          renderItem={
            //({item}) => item.type == 'dir' ? <Card><Text style = {styles.cardLink} onPress = {() => this.onItemPress(item)}>{item.name}</Text></Card> : <Card><Text style = {styles.cardFont} </Text></Card>;
            ({item}) => {if (item.type == 'dir'){
                return <Card><Text style = {styles.cardLink} onPress = {() => this.onItemPress(item)}>{item.name}</Text></Card> 
            }   
            else {
                return <Card><Text style = {styles.cardFont}>{item.name} </Text></Card>;
            } }                                 



                                                 }
        />

      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  dirstyle: {
    backgroundColor: '#F5FCFF',
    flex: 1
  },
  cardFont:{
    color: 'black',
  },
  cardLink:{
    color:'green'
  }

});


const MyNavigator = createStackNavigator(
  {
    Search: {screen: sr},
    Directory: {screen: dir},
  },
  {
    initialRouteName: 'Search',
  }
);



