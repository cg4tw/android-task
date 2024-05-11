import { FlatList, Text, View, TextInput, Button, StyleSheet, RefreshControl, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useState, useEffect} from 'react'; 


  let type:string = '';
  let key:string = '';
  let requestOptions:object = {};
  let intervalId: NodeJS.Timeout;
  const styles = StyleSheet.create({
    container: {
      flex: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      zIndex: 1,
      }
    }
  );

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
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const handleBarCodeScanned = ({ type, data }:  { type: string, data: string }) => {
    setScannerVisible(false);
    setFilterText(data);
    console.log(data);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData().then(() => {
      getSavedData().then(fetchedData => {
        setData(fetchedData);
        setRefreshing(false);
      });
    });
  }, []);


  React.useEffect(() => {
    // Call getData and getSavedData inside useEffect
    getData().then(() => {
      getSavedData().then(fetchedData => setData(fetchedData));
    });

    intervalId = setInterval(() => {
      console.log('Fetching data...');
      getData().then(() => {
        getSavedData().then(fetchedData => setData(fetchedData));
      });
    }, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  const filteredData = data?.filter(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }else{
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: '#f8f8f8' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={filterText}
          onChangeText={setFilterText}
          placeholder="Filter"
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, flex: 1, paddingLeft: 10}}
        />
        </View>
        <Button title='Scan Qr Code' onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            switch (status) {
              case 'granted':
                setScannerVisible(true);
                break;
              case 'denied':
                console.log('denied');
                break;
              case 'undetermined':
                console.log('undetermined');
                break;
            }
          
        }}/>
      </SafeAreaView>
      <SafeAreaView>
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
        refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          />
        }
      />
        )}
    </SafeAreaView>
       
    {isScannerVisible && hasPermission && (
       <Modal
       animationType="slide"
       transparent={false}
       visible={isScannerVisible}
     >
      <View style={StyleSheet.absoluteFill}>
            <View style={{flex: 1, backgroundColor: 'white'}} />
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={{width: '100%', height: '60%'}}
      />
          <View style={{flex: 1, backgroundColor: 'white'}} />
    </View>
      <View>
        <Text>Place the QR code in cameras view to scan</Text>
      </View>
    <Button title='Exit Scanner' onPress={async () => {
                setScannerVisible(false);

        }}/>
    </Modal>
    )}
      
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

//create qr code scanner

//Solved
//add local storage
//create FlatList
//create filter
