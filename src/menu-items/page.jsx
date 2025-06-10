// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'management',
  title: 'Management',
  type: 'group',
  children: [
    {
      id: 'requests',
      title: 'Requests',
      type: 'item',
      url: '/management/requests',
      icon: icons.ProfileOutlined,
      // target: true
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/management/users/users',
      icon: icons.ProfileOutlined,
      // target: true
    },
    {
      id: 'inspections',
      title: 'Inspections',
      type: 'item',
      url: '/management/inspections',
      icon: icons.ProfileOutlined,
      // target: true
    },
    {
      id: 'forms',
      title: 'Forms',
      type: 'item',
      url: '/management/forms',
      icon: icons.ProfileOutlined,
      // target: true
    },
    // {
    //   id: 'roles',
    //   title: 'Role Control',
    //   type: 'item',
    //   url: '/management/users/roles',
    //   icon: icons.ProfileOutlined,
    //   // target: true
    // },
    // {
    //   id: 'audits',
    //   title: 'Audit Center',
    //   type: 'item',
    //   url: '/management/users/audits',
    //   icon: icons.ProfileOutlined,
    //   // target: true
    // }
  ]
};

export default pages;
