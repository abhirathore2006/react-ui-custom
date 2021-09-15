import React, { useEffect } from 'react';
import './style.scss';
import { TableDemo } from './tableDemo';
import { CustomTabs } from './tabs';
import { SnackbarWrapper, useSnackbar } from './snackbar';
import { Sidebar } from './SidebarNav';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

const TestSnack = () => {
  const { enqueSnack, closeSnack } = useSnackbar();
  useEffect(() => {
    let test = {
      variant: 'success',
      message: 'test',
      key: Date.now()
    };
    setTimeout(() => {
      enqueSnack(test);
    }, 2000);
    setTimeout(() => {
      closeSnack(test.key);
    }, 10000);
  }, []);
  // setInterval(() => {

  // }, 5000);
  return <div />;
};
export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexBasis: 300,
            minWidth: 300
          }}
        >
          <Sidebar />
        </div> */}
        <div>
          <SnackbarWrapper>
            <TableDemo />
            <CustomTabs
              tabs={[
                { title: 'hello', content: 'world' },
                { title: 'Tab 2', content: 'Tb2' },
                { title: 'Tab 3', content: 'Tab 3' }
              ]}
            />
            {/* <TestSnack /> */}
          </SnackbarWrapper>
          <div>
            <input list="foo" name="test" />
            <datalist id="foo" className="test">
              <option value="hello" />
              <option value="world" />
            </datalist>
          </div>
        </div>
      </div>
    </Router>
  );
}
