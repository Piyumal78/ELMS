import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CircuitBoard } from "lucide-react";
import { House, Calendar, FileText, GraduationCap, MessageCircleDashed, BookOpen } from "lucide-react";
import StudentNavbar from './StudentNavbar';
import CourseEnroll from './CourseEnroll';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 200;

// Styled Main content
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? `${drawerWidth}` :-200,
  })
);

// Styled AppBar
const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - 60px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    bgcolor: 'blue',
    backdropFilter: 'blur(5px)',
    borderRadius: '10px',
    margin: '10px',
  })
);

// Drawer header for spacing
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

export default function CourseEnrollPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const sidebarItems = [
    { title: 'Dashboard', icon: House, path: '/student' },
    { title: 'Course Enrollment', icon: BookOpen, path: '/course-enroll' },
    { title: 'Lab Booking', icon: Calendar, path: '/student' },
    { title: 'My Reports', icon: FileText, path: '/student' },
    { title: 'Grades', icon: GraduationCap, path: '/student' },
    { title: 'Feedback', icon: MessageCircleDashed, path: '/student' },
  ];

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex',flexDirection:'column',backgroundColor:'#f1f5f9', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar  open={open} sx={{bgcolor:"#1e293b",position:'static',height:65,marginBottom:0}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) ,bgcolor:"blue"}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1,paddingLeft:20 }}>
            <StudentNavbar />
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader >
          <div className="flex p-2 px-4 gap-3 items-center">
            <CircuitBoard size={32} className="text-white bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm p-1" />
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-2xl font-bold">
              ELMS
            </span>
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>

      <Main open={open} sx={{marginLeft:10}}>
        <DrawerHeader />
        <CourseEnroll />
      </Main>
    </Box>
  );
}
