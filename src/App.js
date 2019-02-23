import React, {Component} from 'react';
import Button from '@material/react-button';
import WikiDiff from './wiki-diff'

import './App.scss';
import './Wikipedia.css';
import aDiffJson from './assets/aDiff.json';

// add the appropriate line(s) in Step 3a if you are using compiled CSS instead.

class App extends Component {
  render() {
    return (
      <div>
        <Button
          raised
          className='button-alternate'
          onClick={() => console.log('clicked!') }
        >
          Click Me!
        </Button>

          <WikiDiff diffObj={aDiffJson}>

          </WikiDiff>
      </div>


    );
  }
}




export default App;
