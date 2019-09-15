import React, { Component } from 'react';
import { 
  View, 
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
} from 'react-native';

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          newTodo: '',
          todoList: []
        }
        this.getTodoList = this.getTodoList.bind(this);
    }

    getInitialState() {
      console.log('getInitialState');
    }

    componentWillMount() {
      console.log('componentWillMount');
    }

    componentDidMount() {
      console.log('componentDidMount');
      this.getTodoList();
    }

    shouldComponentUpdate() {
      console.log('shouldComponentUpdate');
      return true;
    }

    componentWillUpdate() {
      console.log('componentWillUpdate');
    }

    componentDidUpdate() {
      console.log('componentDidUpdate');
      //this.getTodoList();
    }

    getTodoList() {
      console.log('getTodoList')
      fetch('http://127.0.0.1:8000/api/todos', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
         todoList: responseJson
        });
      })
      .catch((error) => {
        console.error(error);
      });
    }

    addTodo() {
      fetch('http://127.0.0.1:8000/api/todos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: this.state.newTodo,
        }),
      }).then(() => {
        this.getTodoList();
        this.refs.myInput.blur();   // Unfocus a TextInput in React Native
      });
      this.setState({newTodo: ''});

      //this.getTodoList();
    }

    deleteTodo(id) {
      console.log('deletetodo')
      fetch('http://127.0.0.1:8000/api/todos/'+id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(() => {
        this.getTodoList();
      });
    }

    render() {
      console.log('render');

      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.titleView}>
              My TodoList
            </Text>
            <View style={styles.inputcontainer}>
              <TextInput ref="myInput" style={styles.input} onChangeText={(text) => this.setState({newTodo: text})} value={this.state.newTodo} onSubmitEditing={Keyboard.dismiss} />
              <TouchableHighlight style={styles.button} onPress={() => this.addTodo()} underlayColor='#dddddd'>
              <Text style={styles.btnText}>Add</Text>
              </TouchableHighlight>
            </View>
              <FlatList
                style= {{flex:1}}
                data={this.state.todoList}
                renderItem={({ item }) =>
                  <View style={styles.item}>
                    <Text> {item.title} {"\n"} Last Update:{item.updatedAt}</Text>
                    <TouchableHighlight style={styles.deletebutton} onPress={() => this.deleteTodo(item.id)} underlayColor='#dddddd'>
                    <Text style={styles.btnText}>X</Text>
                    </TouchableHighlight>
                  </View>
                }
                keyExtractor={item => item.id}
              />
          </View>
        </TouchableWithoutFeedback>
      );
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: 'row',
    },
    title: {
      fontSize: 32,
    },
    titleView: {
      marginVertical: 18,
      marginHorizontal: 16,
      padding: 40,
      fontSize: 32,
    },
    inputcontainer: {
      marginTop: 5,
      padding: 10,
      flexDirection: 'row'
    },
    input: {
      height: 36,
      padding: 4,
      marginRight: 5,
      flex: 4,
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#48afdb',
      borderRadius: 4,
      color: '#48BBEC',
    },
    button: {
      height: 36,
      flex: 2,
      flexDirection: 'row',
      backgroundColor: '#48afdb',
      justifyContent: 'center',
      color: '#FFFFFF',
      borderRadius: 4,
    },
    btnText: {
      fontSize: 18,
      color: '#fff',
      marginTop: 6,
    },
    deletebutton: {
      height: 30,
      width: 25,
      position: 'absolute', 
      right: 0,
      flexDirection: 'row',
      backgroundColor: '#FF007F',
      justifyContent: 'center',
      color: '#FFFFFF',
      borderRadius: 4,
    },
});

export default TodoList;