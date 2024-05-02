import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


export default function App() {

  const authorization ="Basic QVBJX0V4cGxvcmVyOjEyMzQ1NmlzQUxhbWVQYXNz";

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 
               'Authorization': authorization},
    body: JSON.stringify({"username":"365", "password":"1"})
  }


  getKey();

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
  async function getKey(){
    
    fetch("https://api.baubuddy.de/index.php/login",requestOptions)
      .then(response => response.json().oauth)
      authorization = response;
}

//Fetch Method for data
async function getData(){
  fetch("https://api.baubuddy.de/index.php/login",requestOptions)
}



