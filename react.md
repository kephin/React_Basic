# React

|  #  | Content |
| :-: | ------- |
|  1. |[Compound component](#Compound-component)|
|  2. |[Understand Lifecycle](#Understand-Lifecycle)|
|  3. |[Performance issue of re-rendering a component](#performance-issue-of-re-rendering-a-component)|
|  4. |[Refactor from if-else or ternary to config object](#Refactor-from-if-else-or-ternary-expression-to-config-object)|
|  5. |[Specifying default props](#Specifying-default-props)|
|  6. |[Avoiding conditionals in render](#Avoiding-conditionals-in-render)|
|  7. |[Controlled element v.s Uncontrolled element](#Controlled-element-v.s-Uncontrolled-element)|
|  8. |[Understand 'this' in JavaScript](#Understand-'this'-in-JavaScript)|
|  9. |[A way to refactor our Axios API call](#A-way-to-refactor-our-Axios-API-call)|
| 10. |[The purpose of keys in list element](#The-purpose-of-keys-in-list-element)|
| 11. |[Access images properties from DOM](#Access-images-properties-from-DOM)|

## Compound component

We can pass any elements, like CommentDetail, html elements or multiple components, **as a props**, down into another component, like ApprovalCard.

```html
<!-- app.js -->
<ApprovalCard>
  <div>
    <h4>Warning!</h4>
    <p>Are you sure?</p>
  </div>
</ApprovalCard>
<!-- or -->
<ApprovalCard>  
  <CommentDetail author='kevin' />
</ApprovalCard>
```

And that component we passed in now exists on this props object.

```javascript
// ApprovalCard component
import React from 'react'
import Title from './Title'

class ApprovalCard extends React.Component {
  state = { someProp: 0 }
  someMethod = () => {
    // ...
  }
  static Title = Title

  render() {
    const { someProp } = this.state
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {someProps, someMethod: this.someMethod})
    })

    return (
      <div className='ui card'>
        <div className='content'>
          {children}
        </div>
      </div>
    )
  }
}

export default ApprovalCard
```

Essentially when we pass one component to another component, the child component, in this case CommentDetail, is going to show up inside of the ApprovalCard on the **props** object. And specifically on the property of the props object called **children**.

## Understand Lifecycle

| Method | What is it | Suggestion |
| ------ | ---------- | ---------- |
| constructor | | good place to do one time setup |
| render | | avoid doing anything but **ONLY** returning JSX |
| componentDidMount | called one time when our component first gets rendered onto the screen | good place to do data loading |
| componentDidUpdate | called any time that our component updates itself | good place to do more data loading when state/props changes |
| componentWillUnmount | called before the component is removed | to do clean up |
| shouldComponentUpdate |||
| getDerivedStateFromProps |||
| getSnapshotBeforeUpdate |||

More information: [Lifecycle in React](./lifecycle.md)

## Performance issue of re-rendering a component

:star: Never initialize any work or request inside render function because render method is going to be called very frequently.

1. Components re-render when the state changes

    The state includes changes from a props change, or from a direct setState change.

    Component changed? Re-render. Parent changed? Re-render. Section of props that doesn't actually impact the view changed? Re-render.

    Whenever we update our state, it will cause our component **ANY** child components contained inside of it to instantly re-render

2. **shouldComponentUpdate** method to the rescue

    By default, shouldComponentUpdate returns **true**.

    ```javascript
    shouldComponentUpdate(nextProps) {
        const isTitleChanged = this.props.title !== nextProps.title;
        const isContentChanged = this.props.content !== nextProps.content
        return isTitleChanged || isContentChanged;
    }
    ```

## Refactor from if-else or ternary expression to config object

:thumbsdown: Using If-Else / Ternary expression:

```javascript
const getSeason = (lat, month) => {
  return month > 2 && month < 9) lat > 0
    ? lat > 0 ? 'summer' : 'winter';
    : lat > 0 ? 'winter' : 'summer';
};

const SeasonDisplay = props => {
  const season = getSeason(props.lat, new Date().getMonth());
  const text = season === 'winter'
    ? 'Burr it is cold.'
    : "Let's hit the beach!";
  const icon = season === 'winter'
    ? 'snowflake'
    : 'sun';

  return (
    <div>
      <i className={`${icon} icon`} />
      <h1>{text}</h1>
    </div>
  );
};
```

:thumbsup: Using config object:

```javascript
const seasonConfig = {
  summer: {
    text: "Let's hit the beach!",
    iconName: 'sun',
  },
  winter: {
    text: 'Burr it is cold.',
    iconName: 'snowflake',
  },
};

const getSeason = (lat, month) => {
  return month > 2 && month < 9) lat > 0
    ? lat > 0 ? 'summer' : 'winter';
    : lat > 0 ? 'winter' : 'summer';
};

const SeasonDisplay = props => {
  const season = getSeason(props.lat, new Date().getMonth());
  const { text, iconName } = seasonConfig[season];

  return (
    <div>
      <i className={`${iconName} icon`} />
      <h1>{text}</h1>
    </div>
  );
};
```

## Specifying default props

```javascript
import React from 'react';

export default const Spinner = props => {
  return (
    <div className='ui active dimmer'>
      <div className='ui text loader'>{props.message}</div>
    </div>
  );
}

Spinner.defaultProps = {
  message: 'Loading...',
}
```

## Avoiding conditionals in render

In general, we always try as much as possible to avoid multiple return statement inside the render function.

:thought_balloon: We might very easily fall into a condition where no matter what, we always want to return what gets wrapped or what gets returned from a component with some common style or format.

:thumbsdown: Multiple return in render function:

```javascript
render() {
  if (this.state.errorMessage && !this.state.lat) {
    return <div>Error: {this.state.errorMessage}</div>;
  }
  if (!this.state.errorMessage && this.state.lat) {
    return <SeasonDisplay lat={this.state.lat}/>;
  }
  
  return <Spinner message='Please accept location request' />;
}
```

:thumbsup: Better practice:

```javascript
renderContent() {
  if (this.state.errorMessage && !this.state.lat) {
    return <div>Error: {this.state.errorMessage}</div>;
  }
  if (!this.state.errorMessage && this.state.lat) {
    return <SeasonDisplay lat={this.state.lat}/>;
  }
  
  return <Spinner message='Please accept location request' />;
}

render() {
  return <div className='border red'>{renderContent()}</div>;
}
```

## Controlled element v.s Uncontrolled element

**Uncontrolled element**: We have to reach into the DOM, find that input element and pull the value out of it. We store the source of truth information inside of our HTML elements.

### React Refs

:bulb: Give access to a single DOM element

We create *refs* in the constructor, assign them to instance variables, then pass to a particular JSX element as props

For example, if we want to access the height of images inside the application

```javascript
import React from 'react';

class ImageCard extends React.Component {
  constructor(props) {
    super(props);

    this.imageCardRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.imageCardRef); // Get all the image properties!!
  }

  render() {
    const { src, alt } = this.props;

    <img ref={this.imageCardRef} src={src} alt={alt} />
  }
}
```

Ref. [Refs and the DOM](https://reactjs.org/docs/refs-and-the-dom.html), 
[Uncontrolled Components](https://reactjs.org/docs/uncontrolled-components.html), [Forwarding Refs](https://reactjs.org/docs/forwarding-refs.html)


**Controlled element**: We store information inside the component state.

:thumbsup: What's good with controlled element?

The entire idea is to make sure that it is the react application that drives and stores all the data.

## Understand *this* in JavaScript

:question: How is the value of *this* determined in a function?

```javascript
class Car {
  setDriveSound(sound) {
    this.sound = sound;
  }

  drive() {
    return this.sound;
  }
}

const car = new Car();
car.setDriveSound('vroom');
car.drive(); // vroom

const truck = {
  sound: 'putputput',
  driveMyTruck: car.drive,
  // is exactly the same as
  driveMyTruck() {
    return this.sound;
  }
};
truck.driveMyTruck(); //putputput
```

:exclamation: The issue here is

```javascript
const drive = car.drive;
drive(); // Uncaught TypeError: Cannot read property 'sound' of undefined
drive; // ƒ drive() { return this.sound; }
```

:bulb: How we solve the issue in react: using arrow function, which bind *this* lexically

```javascript
class SearchBar extends Component {
  state = {
    term: ""
  };

  // wrong
  onFormSubmit(event) {
    event.preventDefault();

    // Uncaught TypeError: Cannot read property 'state' of undefined
    console.log(this.state.term);
  };

  // correct: bind *this* lexically
  onFormSubmit = event => {
    event.preventDefault();

    // *this* will be the SearchBar component
    console.log(this.state.term);
  };

  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.onFormSubmit}>
        <TextField
          //...
        />
      </form>
    );
  }
}
```

:raising_hand: We can also find this issue in another place

When we submit some searching term from SearchBar component, the method *this.props.onSubmit*, which is passed from App component, will be called.

```javascript
// SearchBar component
class SearchBar extends Component {
  state = {
    term: '',
  };

  onFormSubmit = event => {
    event.preventDefault();
    // here!
    this.props.onSubmit(this.state.term);
  };

  render() {
    const { classes } = this.props;

    return (
      <form
        autoComplete="off"
        noValidate
        className={classes.container}
        onSubmit={this.onFormSubmit}
      >
        <TextField
          label="Image Search"
          margin="normal"
          className={classes.textField}
          value={this.state.term}
          onChange={this.onInputChange}
        />
      </form>
    );
  }
}
```

And we look into the `this.props.onSubmit`, which is defined inside App component

```javascript
// App component
class App extends Component {
  state = { images: [] };

  // wrong
  async onSearchSubmit(term) {
    const response = await unsplash.get('/search/photos', {
      params: { query: term },
    });

    // *this* here is the props property of SearchBar component
    console.log(this); // {onSubmit: ƒ}
    this.setState({ images: response.data.results }); // TypeError: this.setState is not a function
  };

  // correct: bind *this* lexically
  onSearchSubmit = async term => {
    const response = await unsplash.get('/search/photos', {
      params: { query: term },
    });

    // *this* here is App component
    this.setState({ images: response.data.results });
  };

  render() {
    return (
      <Fragment>
        <SearchBar onSubmit={this.onSearchSubmit} />
        <ImageList images={this.state.images}/>
      </Fragment>
    );
  }
}
```

## A way to refactor our Axios API call

:thumbsdown: Putting the configuration of the 3rd party API inside every method that need it

```javascript
// App component
import axios from 'axios';

class App extends Component {
  state = { images: [] };

  onSearchSubmit = async term => {
    const response = await axios.get('https://api.unsplash.com/search/photos',{
      params: { query: term },
      headers: {
        Authorization: 'Client-ID d3bf95e6adc7bc93f6f6f726ce53a449c659f2c07be7b6abe85e1ffd7f19177d',
      },
    });

    this.setState({ images: response.data.results });
  };

  render() {
    //...
  }
}
```

:thumbsup: Instead, we extract the configuration of 3rd party API into a separate file, and import it whenever we need it

After refactoring

```javascript
// api/unsplash
import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: 'Client-ID d3bf95e6adc7bc93f6f6f726ce53a449c659f2c07be7b6abe85e1ffd7f19177d',
  },
});

// App component
class App extends Component {
  state = { images: [] };

  onSearchSubmit = async term => {
    const response = await unsplash.get('/search/photos', {
      params: { query: term },
    });

    this.setState({ images: response.data.results });
  };

  render() {
    //...
  }
}
```

## The purpose of keys in list element

:star: It's a purely performance consideration, and it's going to help react to render list or update to a list to be more precise!

## Access images properties from DOM

Two things need to be concerned:

1. Use React Refs to get access to the image JSX

2. We need to add a event listener to wait until the HTML reaching out the that url that we are referencing inside the image tag source and download the image in order to get the image properties

```javascript
import React from 'react';

class ImageCard extends React.Component {
  constructor(props) {
    super(props);
    this.imageCardRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.imageCardRef.current.clientHeight); // image not there yet

    // add a listener to wait until HTML downloading the image
    this.imageCardRef.current.addEventListener('load', () => {
      const gridRowEnd = Math.ceil(this.imageCardRef.current.clientHeight / 10);
      this.setState({ gridRowEnd });
    });
  }

  render() {
    const { src, alt } = this.props;
    <img ref={this.imageCardRef} src={src} alt={alt} />
  }
}
```
