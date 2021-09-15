import React, { useState } from 'react';

import styled from 'styled-components';

const TabWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const TabItem = styled.button`
  flex: 1 1 0;
  background-color: #fff;
  box-shadow: none;
  border: none;
  padding: 8px 16px;
  font-size: 20px;
  border-bottom: 2px solid ${p => (p.selected ? '#e60000' : '#fff')};
`;
const TabContent = styled.div`
  width: 100%;
  margin: 16px 0;
`;
export const CustomTabs = ({ tabs, onChange, initialActive = 0 }) => {
  const [selected, setSelected] = useState(initialActive);
  const handleChange = index => {
    setSelected(index);
    onChange && onChange(initialActive);
  };
  return (
    <React.Fragment>
      <TabWrapper>
        {tabs.map((t, index) => {
          return (
            <TabItem
              key={`tab-${tabs.length}-${index}`}
              selected={index === selected}
              onClick={() => handleChange(index)}
            >
              {t.title}
            </TabItem>
          );
        })}
      </TabWrapper>
      <TabContent>{tabs[selected].content}</TabContent>
    </React.Fragment>
  );
};
