'use srict'

var express= require('express');
var TopicContrloller= require('../controlers/topic');

var router=express.Router();
var md_auth= require('../middleware/aunthenticate');

router.get('/test',TopicContrloller.test);
router.post('/topic',md_auth.auth,TopicContrloller.save);
router.get('/topics/:page?',TopicContrloller.getTopics);
router.get('/user-topics/:user',TopicContrloller.getTopicsByUser);
router.get('/topic/:id',TopicContrloller.getTopic);
router.put('/topic/:id',md_auth.auth,TopicContrloller.update);
router.delete('/topic/:id',md_auth.auth,TopicContrloller.delete);
router.get('/search/:search',TopicContrloller.search);
module.exports=router;