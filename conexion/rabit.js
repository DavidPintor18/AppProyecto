import React, { Component } from 'react';
import {Connection,Queue,Exchange} from 'react-native-rabbitmq';


type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props)

  }

  componentWillMount() {

    const config = {
      host: '192.168.1.67',
      port: '5672',
      username: 'David',   
      password: '123',
      virtualhost: 'virtual',
    };

    let connection = new Connection(config)
    connection.connect()

    let connected = false;
    let queue;
    let exchange;

    connection.on('Conectado', (event) => {

      queue = new Queue(connection, {
        name: '',
        passive: false,
        durable: true,

        exclusive: false,
        consumer_arguments: { 'x-priority': 1 }
      });

      exchange = new Exchange(connection, {
        name: 'direct_log',
        type: 'direct',
        durable: false,
        autoDelete: false,
        internal: false
      });

      queue.bind(exchange, 'info');

      queue.on('coordinate', (data) => {

        if (data.message=="true") {
          const args = {
            number: '',
            prompt: false
          }

          call(args).catch(console.error)

        }
        if (data.message=="cordinate") {
          Toast.show(data.message);

        }



      });



    });

    connection.on('Error', event => {

      connected = false;
      console.log(connection);
      console.log(event);
      console.log("No estás conectado");
    });