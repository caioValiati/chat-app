import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
} from '@mui/material';
import { API_ENDPOINTS } from '../../constants/apiUrls';

export const Sidebar = (props: {userForId: number, setUserForId: (id: number) => void}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_USUARIOS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Bearer')}`,
          },
        });
        setUsuarios(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <Drawer
      anchor="left"
      variant="permanent"

      PaperProps={{
        sx: {
          width: "400px",
          backgroundColor: "#303030",
        }
      }}
    >
      <List>
        {usuarios.map((usuario: any, index) => (
          <ListItem key={usuario.id}>
            <ListItemIcon>
                <Button 
                    fullWidth
                    variant={props.userForId === usuario.id ? "outlined" : "contained"}
                    sx={{ mt: 3, mb: 2 }} 
                    style={{width: "360px"}}
                    key={index} 
                    onClick={() => props.setUserForId(usuario.id)}
                >
                    {usuario.userName}
                </Button>
            </ListItemIcon>
            <ListItemText />
          </ListItem>
        ))}
      </List>
      {error && <Typography variant="body2" color="error">{error}</Typography>}
    </Drawer>
  );
};
