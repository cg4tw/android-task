import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
//import { SafeAreaProvider } from 'react-native-safe-area-context';

var type='';
var key='';

export default function App() {
  getKey();
  getData();
  //return <SafeAreaProvider>...</SafeAreaProvider>;
  return (
    <View style={styles.container}>
      <Text>authorization</Text>
    
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

  //Fetch Method for verification key
  function getKey(){
    
    fetch("https://api.baubuddy.de/dev/index.php/login",{
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 
                 'Authorization': 'Basic QVBJX0V4cGxvcmVyOjEyMzQ1NmlzQUxhbWVQYXNz'},
      body: JSON.stringify({"username":"365", "password":"1"})
    })
      .then(response => response.json())
      .then(data=>{
        type=data.oauth.token_type;
        key=data.oauth.access_token;
      })
      .catch(error => console.error('Error:', error));
}


//Fetch Method for data
function getData(){


  fetch("https://api.baubuddy.de/dev/index.php/v1/tasks/select",{
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 
               'Authorization': type+" "+key},
    body: JSON.stringify({"username":"365", "password":"1"})
  })
  
  .then(response => response.json())
  .then(data=>{
        console.log(data.debug.source);
        console.log(data);


      })
      .catch(error => console.error('Error:', error));

}



