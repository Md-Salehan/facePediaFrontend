import { Box, useMediaQuery } from "@mui/material";
import {useSelector } from 'react-redux';
import Navbar from "../navbar/index";
import UserWidget from '../widgets/UserWidget'
import PostsWidget from "../widgets/PostsWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import AdvertWidget from '../widgets/AdvertWidget'
import FriendListWidget from "../widgets/FriendListWidget";


const HomePage=()=>{
    const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
    const {_id, picturePath} = useSelector((state)=> state.user);


    return ( 
    <Box>
        <Navbar />
        <Box 
            width='100%'
            padding='2rem 6%'
            display={isNonMobileScreens ? 'flex' : 'block'}
            gap='0.5rem'
            justifyContent='space-between'
            
        >
            <Box flexBasis={isNonMobileScreens ? '26%' : undefined }  >
                <UserWidget userId={_id} picturePath={picturePath} />
            </Box>
            <Box 
                flexBasis={isNonMobileScreens ? '42%' : undefined }
                mt={isNonMobileScreens ?  undefined : '2rem'}
                
            >
            <MyPostWidget picturePath={picturePath} />
            <PostsWidget userId={_id} admin="true" />


            </Box>
            {isNonMobileScreens && <Box flexBasis='26%' >
                <AdvertWidget />
                <Box m='2rem 0' />
                <FriendListWidget  userId={_id} admin="true"/>

            </Box> }
        </Box>
    </Box>);
};

export default HomePage;