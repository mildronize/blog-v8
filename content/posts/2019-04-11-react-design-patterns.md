+++
title = "React Design Patterns"
date = "2019-04-11"

[taxonomies]
categories = [ "React" ]
tags = [ "React", "Design Pattern", "JavaScript", "ES6" ]

[extra]
image = "https://www.dropbox.com/s/9u7jxihxp12n06w/2019-03-13-react-pattern.jpg?raw=1"
id = "ho462dz"
unsplashImgCoverId = "1HCb2gPk3ik"
+++


Hi everyone, here is not getting started guide for writing React. You should have some basic of React such as [basic concept of React](https://reactjs.org/docs/hello-world.html) and practical [React tutorial](https://reactjs.org/tutorial/tutorial.html).

## Overview

I'm following [Airbnb style guide](https://github.com/airbnb/javascript/tree/master/react) and using  react in pattern books for references https://github.com/krasimir/react-in-patterns, <https://github.com/vasanthk/react-bits>

### Designing React Web Application

Nowadays, we have many approaches to design the composition of react component.

Here is one of approaches to design

**Preparation**

1. Use Airbnb style guide for consistency code style
2. Use popular React boilerplate (`create-react-app`) for reducing complexity to manage build tools such as webpack, babel, etc.

**Basic Design**

In React documentation describes [Thinking in React](https://reactjs.org/docs/thinking-in-react.html)  for explaining how to design react component and how they compose each others. However, when I 've getting started with React, I realize the component design thinking is most important thing for designing react application. In a React application, it will be at least one component, or can be divided into child component which should work with the parent one.

1. Start with a few React component for reducing the complexity in state management.
2. Break the code down to component when necessary, if it feel easier.
3. The component can break into 2 parts: **Container Component** and **Presentational Component**, when necessary.
   1. Container Component
   2. Presentational Component

**Advanced Design: Reusable Components**

1. Break the code down to component if you want to reuse the components.
2. Use High-order Component when necessary.

### Composing components

1. Passing a child as a prop
2. Passing state through the props
3. Using top component for storing state
4. Using simple state management library for small application
   1. Honorable mention libraries: [pure-store](https://github.com/gunn/pure-store), [unstated](https://github.com/jamiebuilds/unstated) and [unistore](https://github.com/developit/unistore)other approaches are shown at [React State Museum](https://github.com/GantMan/ReactStateMuseum) which good place for reviewing react state management library.
   2. I'm interesting in [mobx](https://github.com/mobxjs/mobx) approaches for small application
5. Using  [Redux](https://github.com/reduxjs/redux) , [mobx](https://github.com/mobxjs/mobx) for big application

Alternative, you can use MVC approach if you familiar, however, in my opinion using MVC on react.

----

## Design Patterns and Techniques

### Component Organization Templates & Patterns

#### Full Feature (Stateful Component)

```jsx
class Person extends React.Component {
  constructor (props) {
    super(props);

    this.state = { smiling: false };

    this.handleClick = () => {
      this.setState({smiling: !this.state.smiling});
    };
  }

  componentWillMount () {
    // add event listeners (Flux Store, WebSocket, document, etc.)
  }

  componentDidMount () {
    // React.getDOMNode()
  }

  componentWillUnmount () {
    // remove event listeners (Flux Store, WebSocket, document, etc.)
  }

  get smilingMessage () {
    return (this.state.smiling) ? "is smiling" : "";
  }

  render () {
    return (
      <div onClick={this.handleClick}>
        {this.props.name} {this.smilingMessage}
      </div>
    );
  }
}

Person.defaultProps = {
  name: 'Guest'
};

Person.propTypes = {
  name: React.PropTypes.string
};

```

Ref: https://github.com/chantastic/react-patterns#component-organization



#### Stateless Component

```jsx
function StatelessComponent(){
  return (
    <div>
      This is Stateless Component.
    </div>
  )
};
```

#### Stateless Component with props

```jsx
function StatelessComponent({ data }){
  return (
    <div>
      {data}
    </div>
  )
};
```

**Container Component**

We can split our component into 2 types: Container component, Presentational component

```jsx
// CommentList.js

class CommentList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.comments.map(({body, author}) => {
          return <li>{body}—{author}</li>;
        })}
      </ul>
    );
  }
}
// CommentListContainer.js

class CommentListContainer extends React.Component {
  getInitialState () {
    return { comments: [] }
  }

  componentDidMount () {
    $.ajax({
      url: "/my-comments.json",
      dataType: 'json',
      success: function(comments) {
        this.setState({comments: comments});
      }.bind(this)
    });
  }

  render () {
    return <CommentList comments={this.state.comments} />;
  }
}
```

Read more for [Presentational and container components](https://krasimir.gitbooks.io/react-in-patterns/content/chapter-06/), using ref https://github.com/chantastic/react-patterns#container-components


----

### JSX Rendering

`if`

```jsx
{isActive && <p>Message</p>}
```

`if-else`

```jsx
{
  isTrue ? (
    <span>Rendered when `TRUE`</span>
  ) : (
    <span>Rendered when `FALSE`</span>
  );
}
```

Loop items for JSX

```jsx
const todos = [
    {id: 1, text: 'Test'},
    {id: 1, text: 'Write a paper'}
]
function sampleComponent(){
  return (
      <ul>
        {todos.map(todo => (
        	<li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
  )
};
```

### Two way binding

```jsx
class App extends React.Component {

  state = {
    textbox: ""
  }
  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.textbox}
          onChange={(e) => this.setState({ textbox: e.target.value })} />
        {this.state.textbox}
      </div>
    );
  }

}
```

----

## Composing components

### File Structure

Todo Components

```
├── components
│   ├── todo
│      ├── index.jsx
│      ├── AddTodo.jsx
│      └── TodoList
│          ├── index.jsx
│          └── Todo.jsx
├── app.js
└── index.js
```

### Passing a child as a prop

Every React component has `children` props.

```jsx
const Title = function () {
  return <h1>Hello there!</h1>;
}
const Header = function ({ title, children }) {
  return (
    <header>
      { title }
      { children }
    </header>
  );
}
function App() {
  return (
    <Header title={ <Title /> }>
      Resting content
    </Header>
  );
};
```

ref: https://krasimir.gitbooks.io/react-in-patterns/content/chapter-04/#passing-a-child-as-a-prop

### Passing state through the props

```jsx
// Counter.jsx
class Counter extends React.Component {
  state = {
    count: 0
  }

  handleAdd(){
    this.setState({ count: this.state.count + 1});
  }

  render() {
    return (
      <CounterView
        value={this.state.count}
        onAdd={() => this.handleAdd()}>
      </CounterView>
    );
  }
}

// CounterView.jsx
function CounterView({ value, onAdd }) {
  return (
    <React.Fragment>
      <div>Count: {value}</div>
      <button onClick={onAdd}>Add</button>
    </React.Fragment>
  );
};
```



### Using top component for storing state

```jsx
// store.js
export default {
  root: {},
  getRoot() {
    return this.root;
  },
  setRoot(value) {
    this.root = value;
  }
}

// Counter.jsx
class Counter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      count: 0
    }
    store.setRoot(this);
  }

  handleAdd(){
    this.setState({ count: this.state.count + 1});
  }

  render() {
    return (
      <CounterView
        value={this.state.count}></CounterView>
    );
  }
}

// CounterView.jsx
function CounterView({ value }) {
  return (
    <React.Fragment>
      <div>Count: {value}</div>
      <button onClick={() => store.getRoot().handleAdd()}>Add</button>
    </React.Fragment>
  );
};
```

Thanks for [Anas](https://anastue.com/)

----

### Share state between components

Design choice:

1. Small Application: [pure-store](https://github.com/gunn/pure-store), [unstated](https://github.com/jamiebuilds/unstated) and [unistore](https://github.com/developit/unistore)
2. Small - Medium Application: [mobx](https://github.com/mobxjs/mobx) (Also using [unstated](https://github.com/jamiebuilds/unstated) and [unistore](https://github.com/developit/unistore) )
3. Using  [Redux](https://github.com/reduxjs/redux) , [mobx](https://github.com/mobxjs/mobx) for big application

Read more how to implement in each state management library in [React State Museum](https://github.com/GantMan/ReactStateMuseum)



### How to choose the composing component pattern?

----

## Style Guide & Naming

### Style Guide

Read more in [Airbnb's Style guide](https://github.com/airbnb/javascript/tree/master/react)

### Naming Events

```jsx
class Owner extends React.Component {
  handleClick () {
    // handle click event
  }

  render () {
    return <div onClick={() => this.handleClick()}></div>;
  }
}
```

Original: <https://github.com/chantastic/react-patterns#naming-events>



---





## Other Resources

Other topics can read in below resources:

- [React Design principles](https://facebook.github.io/react/contributing/design-principles.html)
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [React in pattern by krasimir](https://github.com/krasimir/react-in-patterns)
- [React patterns at Planning Center Online](https://github.com/planningcenter/react-patterns)
- [React patterns by Michael Chan](http://reactpatterns.com/)
- [React patterns, techniques, tips and tricks](https://github.com/vasanthk/react-bits)



State

- [React State Museum](https://github.com/GantMan/ReactStateMuseum)


P.S. PR, Suggestions are welcome

