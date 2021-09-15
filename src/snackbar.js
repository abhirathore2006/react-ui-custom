import React, { useContext, useState } from 'react';
import styled from 'styled-components';

const SnackbarContext = React.createContext({});

const SnackViewWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  position: absolute;
  top: 100px;
  right: 40px;
  z-index: 9999;
  @keyframes slideInRight {
    from {
      right: -100px;
    }
    to {
      right: 0px;
    }
  }
`;

const bgMap = {
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  success: '#4caf50'
};
const SnackItem = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 240px;
  background-color: ${p => bgMap[p.type]};
  color: #fff;
  padding: 8px 16px;
  margin-bottom: 8px;
  position: relative;
  animation-name: slideInRight;
  animation-duration: 0.5s;
`;

const SnackItemMessage = styled.div`
  flex-grow: 1;
  color: inherit;
`;

const SnackClose = styled.button`
  border: none;
  background-color: transparent;
  box-shadow: none;
  color: inherit;
`;
export const SnackbarWrapper = props => {
  const [snacks, setSnacks] = useState([]);
  const enqueSnack = snack => {
    setSnacks(snacks => [...snacks, snack]);
  };
  const closeSnack = key => {
    setSnacks(snacks => snacks.filter(s => s.key !== key));
  };
  return (
    <SnackbarContext.Provider value={{ enqueSnack, closeSnack }}>
      {props.children}
      <SnackViewWrapper>
        {snacks.map(s => {
          return (
            <SnackItem key={s.key} type={s.variant}>
              <SnackItemMessage>{s.message}</SnackItemMessage>
              <SnackClose onClick={() => closeSnack(s.key)}>x</SnackClose>
            </SnackItem>
          );
        })}
      </SnackViewWrapper>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const { enqueSnack, closeSnack } = useContext(SnackbarContext);
  return { enqueSnack, closeSnack };
};
