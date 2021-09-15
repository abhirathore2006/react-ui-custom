import React, { useEffect, useState } from 'react';
import './sidebar.scss';
import { NavLink, useLocation } from 'react-router-dom';
export const MenuItem = ({ item: { path, title, menu = [] }, setIsOpen }) => {
  const { pathname: activePath } = useLocation();
  const [active, setIsActive] = useState(false);
  const [isChildrenActive, setIsChildrenActive] = useState(false);
  console.log('pathname', activePath);
  useEffect(() => {
    if (activePath === path) {
      setIsActive(true);
      if (setIsOpen) {
        setIsOpen();
      }
    }
  }, [activePath]);
  const setOpen = () => {
    setIsChildrenActive(true);
  };
  return (
    <li className={active ? 'active' : ''}>
      <div>
        <NavLink to={path}>{title}</NavLink>
      </div>
      <div>
        <ul>
          {menu.map(item => {
            return <MenuItem item={item} setIsOpen={setOpen} />;
          })}
        </ul>
      </div>
    </li>
  );
};

const MenuData = [
  {
    path: '/client-setup',
    title: 'Client Setup',
    menu: [
      {
        path: '/client-setup/divisions',
        title: 'divisions',
        menu: [{ path: '/client-setup/divisons/test', title: 'Test' }]
      }
    ]
  }
];
export const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        {MenuData.map(item => {
          return <MenuItem item={item} />;
        })}
      </ul>
    </div>
  );
};
