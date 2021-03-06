import React, {useState} from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux' //리덕스에서 user 정보 가져옴
import SingleComment from '../Sections/SingleComment'
import ReplyComment from '../Sections/ReplyComment'

function Comment(props) {

    const videoId = props.postId;

    const user = useSelector(state => state.user); //리덕스에서 user 정보 가져옴
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (e) => {
    setcommentValue(e.currentTarget.value)
}


    const onSubmit = (e) => {
         e.preventDefault();

    const variables = {
        content: commentValue,
        writer: user.userData._id, //리덕스에서 user 정보 가져옴
        postId: videoId

    }

  Axios.post('/api/comment/saveComment', variables)
  .then(response => {
      if(response.data.success){
           console.log(response.data.result)
           setcommentValue("")
           props.refreshFunction(response.data.result)
      }else {
        alert('댓글을 저장하지 못했습니다.')
    }
  })
}

    return (
        <div>
            <br />
            <p>Replies</p>
            <br />
            {/*Comment Lists */}

            {props.commentLists && props.commentLists.map((comment, index) => (
             (!comment.responseTo && 
            <React.Fragment key={comment._id}>
                <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={videoId} commentLists={props.commentLists} />
             </React.Fragment>
         )
            ))}

            

            {/*Root Comment From */}

            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea
                style={{width: '100%', borderRadius: '5px'}}
                onChange={handleClick}
                value={commentValue}
                placeholder="댓글 남기기"
                />
                <br />
                <button style={{width: '20%', height: '52px'}} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment
