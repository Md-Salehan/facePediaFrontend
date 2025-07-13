import { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { setPosts } from "../../state";
import PostWidget from './PostWidget';

const PostsWidget = ({userId, isProfile })=> {
    const dispatch = useDispatch();
    const posts = useSelector((state)=>state.posts);
    const token = useSelector((state)=>state.token);
    
    const getPosts = async()=>{
        const response = await fetch(process.env.REACT_APP_SERVER+'/posts',{
            method:'GET',
            headers:{Authorization : 'Bearer '+token },

        });
        const data = await response.json();
        dispatch(setPosts({posts:data}));
    }
    const getUserPosts = async()=>{
        const response = await fetch(process.env.REACT_APP_SERVER+'/posts/'+userId+'/posts',{
            method:'GET',
            headers:{ Authorization : 'Bearer '+ token },
        });
        const data = await response.json();
        //console.log('data : ',data)
        dispatch(setPosts({posts:data}));
       // console.log('data : ',data)
    }
//console.log('isProfile ->',isProfile)
    useEffect(()=>{
        if(isProfile){
            // console.log("Only user Posts")
            getUserPosts();
        }
        else {
            // console.log("All Posts")
            getPosts();
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    },[])

    return (
        <>
            {!Array.isArray(posts[0]) && Array.isArray(posts) && posts.length > 0 ? (
                [...posts].reverse().map(({
                     _id, 
                     userId, 
                     firstName, 
                     lastName, 
                     description, 
                     location, 
                     picturePath,
                     faces, 
                     tags,
                     userPicturePath, 
                     likes, 
                     comments }) => (
                    <PostWidget
                        key={_id}
                        postId={_id}
                        postUserId={userId}
                        name={firstName + ' ' + lastName}
                        description={description}
                        location={location}
                        picturePath={picturePath}
                        faces={faces}
                        tags={tags}
                        userPicturePath={userPicturePath}
                        likes={likes}
                        comments={comments}
                    />
                ))
            ) : (
                <h1>No posts available.</h1>
            )}
        </>
    );
    


}

export default PostsWidget;