import { Box, Typography } from "@mui/material";
import UserImage from "./UserImage";
import { format } from "timeago.js";

const CommentSection = ({ comments, main }) => {

  return (
    <>
      {[...comments].reverse().map((comment, i) => (
        <Box
          key={`${comment.name}-${i}`} // Use comment properties for key
          display="flex"
          alignItems="flex-start"
          gap="0.5rem"
          sx={{ mb: "0.5rem" }}
        >
          {/* User profile picture */}
          <UserImage image={comment.userPic} size="45px" />

          {/* Comment content */}
          <Box>
            <Typography
              sx={{
                color: main,
                m: "0.5rem 0",
                pl: "0.5rem",
                textAlign: "left",
              }}
            >
              {comment.text}
            </Typography>
            <Typography
              sx={{
                color: 'gray',
                fontSize: '0.75rem',
                pl: "0.5rem",
              }}
            >
            {format(comment.createdAt)}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default CommentSection;
