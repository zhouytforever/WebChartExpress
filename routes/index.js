var express = require('express');
var router = express.Router();
var online = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});


router.post('login',function(req,res,next){
  if(existsUser(req.body.username)) {
    res.render('loginAnother', {user: req.body.username});
  }else{
    res.render('home');
  }
});

function existsUser(item){
  for(var a in online){
    if(online[a] == item){
      return true;
    }
    return false;
  }
}

module.exports = router;
