'use srict'

var express= require('express');
var CommentContrloller= require('../controlers/comment');

var router=express.Router();
var md_auth= require('../middleware/aunthenticate');

router.post('/comment/topic/:topicId',md_auth.auth,CommentContrloller.add);
router.put('/comment/:commentId',md_auth.auth,CommentContrloller.update);
router.delete('/comment/:topicId/:commentId',md_auth.auth,CommentContrloller.delete);

module.exports=router;