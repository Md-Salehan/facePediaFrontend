import React from 'react';
import { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WidgetWrapper from "../../components/WidgetWrapper";
import Navbar from "../navbar";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    IconButton,
  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { setFriends } from '../../state';
import { format } from "timeago.js";

function Notifications() {
  const token = useSelector((state) => state.token);
  const {_id} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
    const [notificationList, setNotificationList] = useState([ ]);

    const fetchNotifications = async () => {
          try {
              const response = await fetch(
                   process.env.REACT_APP_SERVER+`/users/${_id}/notifications`,
                  {
                      method: "GET",
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                  }
              );

              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const data = await response.json();
              console.log(data)
              let arr = [];
              for (let i = 0 ; i<data.length ; i++){
                let notification = {
                  "id" : data[i]._id,
                  "des" : data[i].message,
                  "type" : data[i].type,
                  "postId" : data[i].postId,
                  "time" : data[i].timestamp,
                }
                arr.push(notification)
              }
              setNotificationList(arr.reverse())
          } catch (error) {
              console.error('Error updating friend:', error);
          }
      
  };
  useEffect(()=>{
fetchNotifications();
  },[])

  const followBack = async (friendId) => {
        try {
            const response = await fetch(
                process.env.REACT_APP_SERVER+`/users/${_id}/${friendId}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            dispatch(setFriends({ friends: data }));
            
        } catch (error) {
            console.error('Error updating friend:', error);
        }
};


    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const removeNotification = async (notification)=>{
        console.log(notification);
        setNotificationList(notificationList.filter((n)=>n._id!==notification._id))
        try {
          const response = await fetch(
               process.env.REACT_APP_SERVER+`/users/${_id}/notifications/${notification.id}/seen`,
              {
                  method: "POST",
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
                  body:'',
              }
          );

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data)

      } catch (error) {
          console.error('Error updating friend:', error);
      }
        
    }


        return (
            <>
<Navbar />
<Box
  width="100%"
  padding="2rem 6%"
  display={isNonMobileScreens ? "flex" : "block"}
  gap="2rem"
  justifyContent="center"
>
{notificationList.length > 0 ?
  (<WidgetWrapper flexBasis={isNonMobileScreens ? "85%" : "100%"}>
    {notificationList.map((notification) => (
      <Box
        key={notification.id}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="1.5rem"
        margin="1rem 0"
        borderRadius="8px"
        bgcolor="background.paper"
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
        transition="all 0.3s ease"
        sx={{
          "&:hover": {
            bgcolor: "background.default",
            transform: "scale(1.02)",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
<Box
  sx={{
    display: "flex",
    flexDirection: "column", // Ensures the timestamp is below the description
    gap: "0.25rem", // Adds spacing between the description and timestamp
  }}
>
  <Typography
    variant="h6"
    color="text.primary" // Dynamically adapts to light/dark mode
    fontWeight={500}
    sx={{
      "&:hover": {
        color: "text.secondary", // Softer color on hover
        cursor: "pointer",
      },
    }}
  >
    {notification.des}
  </Typography>
  <Typography
    variant="body2" // Smaller font for the timestamp
    color="text.secondary" // Softer color for the timestamp
  >
    {format(notification.time)}
  </Typography>
</Box>

        {
  notification.type === "follow" && (
    <Box display="flex" gap="1rem" marginLeft="auto">
      {/* VISIT Button */}
      <IconButton
        onClick={()=>{navigate(`/profile/${notification.postId}`)}}
        sx={{
    padding: "0.4rem 1rem", // Compact padding
    borderRadius: "8px", // Slightly rounded corners
    bgcolor: "primary.main", // Use theme's primary color
    color: 'palette.primary.dark',
    fontSize: "0.875rem", // Smaller, minimalist font size
    fontWeight: 500, // Medium font weight for readability
    letterSpacing: "0.5px", // Subtle spacing for text
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // Subtle shadow
    textTransform: "uppercase", // Minimalist uppercase styling
    "&:hover": {
      bgcolor: "primary.dark", // Darker shade on hover
      transform: "scale(1.03)", // Slight scaling effect on hover
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)", // Enhanced shadow on hover
    },
    transition: "all 0.2s ease-in-out", // Smooth transition
    cursor: "pointer", // Pointer cursor for better UX
  }}
      >
        VISIT
      </IconButton>
      {/* FOLLOW Button */}
      <IconButton
      onClick={()=>{followBack(notification.postId)}}
      sx={{
    padding: "0.4rem 1rem", // Compact padding
    borderRadius: "8px", // Slightly rounded corners
    bgcolor: "primary.main", // Use theme's primary color
    color: 'palette.primary.dark',
    fontSize: "0.875rem", // Smaller, minimalist font size
    fontWeight: 500, // Medium font weight for readability
    letterSpacing: "0.5px", // Subtle spacing for text
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // Subtle shadow
    textTransform: "uppercase", // Minimalist uppercase styling
    "&:hover": {
      bgcolor: "primary.dark", // Darker shade on hover
      transform: "scale(1.03)", // Slight scaling effect on hover
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)", // Enhanced shadow on hover
    },
    transition: "all 0.2s ease-in-out", // Smooth transition
    cursor: "pointer", // Pointer cursor for better UX
  }}
      >
        FOLLOW
      </IconButton>
    </Box>
  )
}
{
  notification.type === "tag" && (
    <Box display="flex" gap="1rem" marginLeft="auto">
      {/* VIEW Button */}
      <IconButton
  onClick={() => navigate(`/posts/${notification.postId}`)}
  sx={{
    padding: "0.4rem 1rem", // Compact padding
    borderRadius: "8px", // Slightly rounded corners
    bgcolor: "primary.main", // Use theme's primary color
    color: 'palette.primary.dark',
    fontSize: "0.875rem", // Smaller, minimalist font size
    fontWeight: 500, // Medium font weight for readability
    letterSpacing: "0.5px", // Subtle spacing for text
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // Subtle shadow
    textTransform: "uppercase", // Minimalist uppercase styling
    "&:hover": {
      bgcolor: "primary.dark", // Darker shade on hover
      transform: "scale(1.03)", // Slight scaling effect on hover
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)", // Enhanced shadow on hover
    },
    transition: "all 0.2s ease-in-out", // Smooth transition
    cursor: "pointer", // Pointer cursor for better UX
  }}
>
  view
</IconButton>

    </Box>
  )
}

        <IconButton
          aria-label="close"
          sx={{
            color: "text.secondary", // Subtle color for the close icon
            "&:hover": {
              color: "error.main",
              transform: "scale(1.2)",
            },
            transition: "color 0.2s ease, transform 0.2s ease",
          }}
          onClick={()=>{removeNotification(notification)}}
        >
          <CloseIcon />
        </IconButton>
        
      </Box>
      
    ))}
    
  </WidgetWrapper>)
  :
  <h1>NO NEW NOTIFICATOINS</h1>
  
  }
</Box>


            </>
          );
        
}

export default Notifications