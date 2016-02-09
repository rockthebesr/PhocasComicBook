///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>

///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>

interface UserInterface {
  getName(): string;
  getEmail(): string;

}
class User implements UserInterface {
  private name;
  private email;

  constructor(name: string, email:string) {
    this.name = name;
    this.email = email;
  }
  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

}
class Router {
  router;

  constructor() {

    var express = require('express');
    var router = express.Router();

    var multer = require('multer');
    var upload = multer({ dest: './public/uploads'});

    /* GET login page. */
    router.get('/sign_in', function(req, res, next) {
      res.render('sign_in', { title: 'sign in' });
    });

    /* GET signup page. */
    router.get('/sign_up', function(req, res, next) {
      res.render('sign_up', { title: 'sign up' });
    });

    /* GET Hello World page. */
    router.get('/helloworld', function(req, res) {
      res.render('helloworld', { title: 'Hello, World!' });
    });


    /* GET Userlist page. */
    router.get('/userlist', function(req, res) {
      var db = req.db;
      var collection = db.get('usercollection');
      collection.find({},{},function(e,docs){
        res.render('userlist', {
          "userlist" : docs,
        });
      });
    });


    /* GET New User page. */
    router.get('/newuser', function(req, res) {
      res.render('newuser', { title: 'Add New User' });
    });


    /* POST to Add User Service */
    router.post('/adduser', function(req, res) {

      // Set our internal DB variable
      var db = req.db;

      // Get our form values. These rely on the "name" attributes
      var newUser = new User(req.body.username, req.body.useremail);

      // Set our collection
      var collection = db.get('usercollection');

      // Submit to the DB
      collection.insert({
        "username" : newUser.getName(),
        "email" : newUser.getEmail()
      }, function (err, doc) {
        if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
        }
        else {
          // And forward to success page
          res.redirect("userlist");
        }
      });
    });


    /* GET Home page. */
    router.get('/', function(req, res) {
      var db = req.db;
      var collection = db.get('uploadedSets');
      collection.find({},{},function(e,docs){
        var firsturls : Array<string> = [];
        var setTitles : Array<string> = [];

        var i = 0;
        for (var comicset of docs) {
          var imagelist = comicset.imageList;
          var firstimage = imagelist[0];

          var url = firstimage.imageUrl;
          var title = firstimage.comicSetTitle;

          firsturls[i] = url;
          setTitles[i] = title;
          i += 1;
        }
        res.render('home_page', {
          "urls" : firsturls,
          "titles" : setTitles,
        });
      });
    });


    /* Get Comic page. */
    router.get('/comic_page/:comic_set_title', function (req, res) {
        var db = req.db;
        var collection = db.get('uploadedSets');
        var comicSetTitle = req.params.comic_set_title;
      collection.find({title : comicSetTitle}, function(docs){
          res.render('comic_page', {
              "comicSet" : docs,
              "title": docs.title,
              "imageList": docs.imageList
          });
      });
    });


    /* Get Edit Comics page. */
    router.get('/edit_comic', function (req, res) {
      var db = req.db;
      var collection = db.get('uploadedImages');
      collection.find({},{},function(e,docs){
        res.render('edit_comic', {
          "imageList" : docs
        });
      });
    });


    /* Get Manage Comics page. */
    router.get('/manage_comics', function (req, res) {
      res.render('manage_comics', { title: 'manage_comics'});
    });

    /* Save image to database*/
    router.post('/upload',  upload.single("image"), function(req, res) {
      var fs = require("fs");
      var oldPath = req.file.path;
      var newPath = oldPath + '.jpg';
      console.log(newPath);
      fs.rename(oldPath, newPath, function() {

        var db = req.db;
        // Set our collection
        var collection = db.get('uploadedImages');
        collection.insert({
          "comicSetTitle" : "",
          "imageUrl" : newPath.slice(7, newPath.length),
        }, function (err, doc) {
          if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
          }
          else {
            res.redirect('edit_comic');
          }
        });
      });
    });

    router.post('/uploadComicSet', function(req, res) {
      var db = req.db;
      var collection = db.get('uploadedSets');
      // Submit to the DB
      collection.insert({
        "title" : req.body.comicSetTitle,
        "imageList" : req.body.imageList
      }, function (err, doc) {
        if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
        }
        else {
          // And forward to success page
          console.log("saved");
          res.send({redirect: '/'});
        }
      });
    });

    this.router = router;
  }

}
var router = new Router();
module.exports = router.router;
