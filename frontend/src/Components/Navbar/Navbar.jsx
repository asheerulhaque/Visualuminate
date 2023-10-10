import React from 'react';
import './Navbar.css'; // Import your CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faFileAlt,faSearch } from '@fortawesome/free-solid-svg-icons'; // Sample FontAwesome icons
import Avatar from 'react-avatar';
import Menu from '@mui/material/Menu';
import Notify from '@mui/icons-material/Notifications';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Person from '@mui/icons-material/Person';
import Help from '@mui/icons-material/Help';
import Billing from '@mui/icons-material/Wallet';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Badge from '@mui/material/Badge';


const Navbar = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo" className="logo" /> 
      </div>

      <ul className="navbar-nav">
        <li className="nav-item">
          <a href="/" className="nav-link" id='dashboard'>
            <FontAwesomeIcon icon={faHome} className="nav-icon" />
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a href="/analytics" className="nav-link">
            <FontAwesomeIcon icon={faChartLine} className="nav-icon" />
            Analytics
          </a>
        </li>
        <li className="nav-item">
          <a href="/reports" className="nav-link">
            <FontAwesomeIcon icon={faFileAlt} className="nav-icon" />
            Reports
          </a>
        </li>
        <li className="nav-item" id='search-item'>
            <span className='nav-search' id='search-bar'>
            <FontAwesomeIcon icon={faSearch} className="nav-icon" />
            <input type="text" className="search" placeholder='Search'/>
            </span>
        </li>
      </ul>  
       <div className='avatar' >
         <Badge color='success'  anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}overlap="circular" badgeContent=" " variant="dot" >
          <Avatar onClick={handleClick} src='https://avatars.githubusercontent.com/u/101623496?v=4' size="50" round={true} />
        </Badge>
        </div>
          <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Badge color='success'  anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}overlap="circular" badgeContent=" " variant="dot" >
          <Avatar onClick={handleClick} src='https://avatars.githubusercontent.com/u/101623496?v=4'  size="50" round={true} />
        </Badge>
          <div class="v-list-item__content" data-no-activator="" style={{marginLeft:'10px'}}>
            <div class="v-list-item-title font-weight-medium" style={{color:'white',fontSize:'17px'}}>Asheerul Haque</div>
            <div class="v-list-item-subtitle" style={{fontSize:'15px', color:'#f7efefe3'}}>admin</div>
          </div>
        </MenuItem>

        <Divider />
        <MenuItem onClick={handleClose} style={{color:'#f7efefe3'}}>
           <ListItemIcon style={{color:'white'}}>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose} style={{color:'#f7efefe3'}}>
           <ListItemIcon style={{color:'white'}}>
            <Notify fontSize="small" />
          </ListItemIcon>
          Notification
        </MenuItem>
        <MenuItem onClick={handleClose} style={{color:'#f7efefe3'}}>
          <ListItemIcon style={{color:'white'}}>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose} style={{color:'#f7efefe3'}}>
           <ListItemIcon style={{color:'white'}}>
            <Billing fontSize="small" />
          </ListItemIcon>
          Billing
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} style={{color:'#f7efefe3'}}>
           <ListItemIcon style={{color:'white'}}>
            <Help fontSize="small" />
          </ListItemIcon>
          Help
        </MenuItem>
        <MenuItem onClick={handleClose} style={{color:'#f7efefe3'}}>
          <ListItemIcon style={{color:'white'}}>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
        
    </nav>
  );
};

export default Navbar;
