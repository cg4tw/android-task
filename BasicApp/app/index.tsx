import { StatusBar } from 'expo-status-bar';
import { FlatList, Text, View, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react'; 

  let type:string = '';
  let key:string = '';
  let requestOptions:object = {};



  
  const storeData = async (value:object) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('my-key', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getSavedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('my-key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
    //getKey getData and update local storage
    getData();

    //resolve data from local storage
    getSavedData().then(data => 
       //Create list
      console.log(data));


   

export default function Index() {
  //Initial start of the app
  const [data, setData] = React.useState<any[]>([]);

  const [filterText, setFilterText] = React.useState('');

  React.useEffect(() => {
    // Call getData and getSavedData inside useEffect
    getData().then(() => {
      getSavedData().then(fetchedData => setData(fetchedData));
    });
  }, []);


  const filteredData = data?.filter(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (

    <SafeAreaProvider>
      
      <SafeAreaView style={{ backgroundColor: '#f8f8f8' }}>
        <TextInput
          value={filterText}
          onChangeText={setFilterText}
          placeholder="Filter"
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        />
      </SafeAreaView>
      <View>

{filteredData && (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ padding: 10, margin: 10, backgroundColor: item.colorCode }}>
               <Text>{item.task}</Text>
               <Text>{item.title}</Text>
               <Text>{item.description}</Text>
              </View>
            )}
          />
        )}
    </View>
    </SafeAreaProvider>

    
  );
}


//Fetch Method for verification key
async function getKey(){
    
  await fetch("https://api.baubuddy.de/dev/index.php/login",{
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 
               'Authorization': 'Basic QVBJX0V4cGxvcmVyOjEyMzQ1NmlzQUxhbWVQYXNz'},
    body: JSON.stringify({"username":"365", "password":"1"})
  })
    .then(response => response.json())
    .then(data=>{
      

      requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json' ,
        credentials: 'include',
           'Authorization':data.oauth.token_type+" "+data.oauth.access_token,
        
        },
        };

    })
    .catch(error => console.error('Error:', error));
}


//Fetch Method for data
async function getData(){
getKey();
const wait = await getKey();

await fetch("https://365.1@api.baubuddy.de/dev/index.php/v1/tasks/select/",requestOptions)
.then(response => response.json())
.then(data=>{
  //method to store data in local storage
  storeData(data);
    })
    .catch(error => console.error('Error:', error));

    
}




//TO DO LIST

//need to add if to check for network avalability and to check for server response
//if server response is 200 then we can continue with the app, else load data from local storage

//create filter
//create qr code scanner

//Solved
//add local storage
//create FlatList