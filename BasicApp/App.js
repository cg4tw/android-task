import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
//import { SafeAreaProvider } from 'react-native-safe-area-context';



export default function App() {

  let type='';
  let key='';
  

  //need to add if to chech for network avalability and to check for 
  //Initial start of the app
  getKey();
  getData();

  //

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
        global.type=data.oauth.token_type;
        global.key=data.oauth.access_token;


      })
      .catch(error => console.error('Error:', error));
}



let requestOptions = {
  method: 'GET',
  headers: {'Content-Type': 'application/json' ,
  credentials: 'include',
     'Authorization':type+" "+key,

  },
};

//Fetch Method for data
function getData(){

  fetch("https://365.1@api.baubuddy.de/dev/index.php/v1/tasks/select/",requestOptions)
  
  .then(response => response.json())
  .then(data=>{

    console.log(data);

      })
      .catch(error => console.error('Error:', error));

      
}



