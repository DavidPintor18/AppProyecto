/*
Escaner de codigos QR
*/
import React, { Component, } from 'react';
import { Text, View, Linking, TouchableHighlight, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import { CameraKitCameraScreen, } from 'react-native-camera-kit';
import {Icon, Button, CardItem, Card,} from 'native-base';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      //Variable para guardar el valor del QR
      qrvalue: '',
      opneScanner: false,
    };
  }
  onOpenlink() {
    //Función para abrir una URL si es que se ha escanedo una
    Linking.openURL(this.state.qrvalue);
    //Enlace usado para abrir la URl en cualquier navegador que tengas instalado
  }
  onBarcodeScan(qrvalue) {
    //Llamado despues de escanear un QR ó Codigo de barras con éxito
    this.setState({ qrvalue: qrvalue });
    this.setState({ opneScanner: false });
  }
  onOpneScanner() {
    var that =this;
    //Se comienza a escanear
    if(Platform.OS === 'android'){
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,{
              'title': 'Necesitamos tu permiso para usar la camara',
              'message': 'La app necesita tu permiso para utilizar la camara'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Si el permiso de la camera es concedido
            that.setState({ qrvalue: '' });
            that.setState({ opneScanner: true });
          } else {
            alert("El permiso de la camara fue denegado");
          }
        } catch (err) {
          alert("Permiso de la camara denegado",err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      //Llamando la función del permiso de la camara
      requestCameraPermission();
    }else{
      that.setState({ qrvalue: '' });
      that.setState({ opneScanner: true });
    }    
  }
  render() {
    let displayModal;
    //Se envia el valor del QR a esta vista
    if (!this.state.opneScanner) {
      return (
        <View style={styles.container}>
            <Text style={styles.heading}>SkyHealth</Text>
            <Text style={styles.simpleText}>{this.state.qrvalue ? 'Resultado: '+this.state.qrvalue : ''}</Text>
            {this.state.qrvalue.includes("http") ? 
              <TouchableHighlight
                onPress={() => this.onOpenlink()}
                style={styles.button}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Ir al enlace.</Text>
              </TouchableHighlight>
              : null
            }
            <TouchableHighlight
              onPress={() => this.onOpneScanner()}
              style={styles.button}>
                <Text style={{ color: '#FFFFFF', fontSize: 12 }} >
                Escanear QR.
                </Text>
            </TouchableHighlight>
            <Text style={styles.simpleText}>Visitanos</Text>
            <CardItem>
              <Button style = { loginIcon.facebook} onPress={ ()=> Linking.openURL('https://sistemadeemergencias.000webhostapp.com') }><Icon type = 'MaterialCommunityIcons' name = 'web'></Icon></Button>
            </CardItem>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraKitCameraScreen
          showFrame={true}
          //Mostar/esconder el marco para escanear
          scanBarcode={true}
          //Se puede restringir para leer solamente QR
          laserColor={'white'}
          frameColor={'white'}
          //Si el marco es visible coloca el color de este
          colorForScannerFrame={'black'}
          
          onReadCode={event =>
            this.onBarcodeScan(event.nativeEvent.codeStringValue)
          }
          
        />
        
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2c3539',
    padding: 10,
    width:300,
    marginTop:16
  },
  heading: { 
    color: 'black', 
    fontSize: 24, 
    alignSelf: 'center', 
    padding: 10, 
    marginTop: 30 
  },
  simpleText: { 
    color: 'black', 
    fontSize: 20, 
    alignSelf: 'center', 
    padding: 10, 
    marginTop: 16
  }
});
const loginIcon = StyleSheet.create({
  google:{
    width: '100%',
    height: '135%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d34836',
  },
  facebook:{
    width: '25%',
    height: '120%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998'
  }
})