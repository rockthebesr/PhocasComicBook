///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>

///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>

interface UserInterface {
  getName(): string;
  getPassword(): string;

}
class User implements UserInterface {
  private name;
  private password;

  constructor(name: string, password:string) {
    this.name = name;
    this.password = password;
  }
  getName(): string {
    return this.name;
  }

  getPassword(): string {
    return this.password;
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

    router.post('/sign_in', function (req, res) {
            var db = req.db;
             var collection = db.get('usercollection');
 
             collection.findOne({ username: req.body.username}, function(err, user) {
                 if (!user) {
                     res.send( 'Invalid username or password');
                 }   else {
                     if (req.body.userpassword === user.password) {
                         res.redirect('/');
                     } else {
 
                         res.send('Invalid username or password');
                     }
                 }
                 });
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
    router.post('/sign_up', function(req, res) {

      // Set our internal DB variable
      var db = req.db;

      // Get our form values. These rely on the "name" attributes
      var newUser = new User(req.body.username, req.body.userpassword);

      // Set our collection
      var collection = db.get('usercollection');

      // Submit to the DB
      collection.findOne({ username: req.body.username}, function(err, user) {
                if (user) {
                    res.send( 'Username exists');
                } else if (req.body.userpassword.length < 8) {
                    res.send( 'Password is too short');
                } else {
                collection.insert({
                "username": newUser.getName(),
                "password": newUser.getPassword()
            }, function (err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                }
                else {
                    // And forward to success page
                    res.redirect('/');
                }
            });
            }
        });


    /* GET Home page. */
    router.get('/', function(req, res) {
      var db = req.db;
      var collection = db.get('uploadedSets');
      collection.find({},{},function(e,docs){
        var urlAndtitle : Array<Array<string>> = [];

        var i = 0;
        for (var comicset of docs) {
          var imagelist = comicset.imageList;
          var firstimage = imagelist[0];

          var url = firstimage.imageUrl;
          var title = firstimage.comicSetTitle;

          var singleurlAndtitle : Array<string> = [];
          singleurlAndtitle[0] = title;
          singleurlAndtitle[1] = url;

          urlAndtitle[i] = singleurlAndtitle;
          i += 1;
        }

        res.render('home_page', {
          "urlAndtitle" : urlAndtitle,
        });
      });
    });


    /* Get Comic page. */
    router.get('/comic_page/:comic_set_title', function (req, res) {
        var db = req.db;
        var collection = db.get('uploadedSets');
        var comicSetTitle = req.params.comic_set_title;
        collection.find({}, {}, function(err,docs) {
          var nextSet = undefined;
          var prevSet = undefined;
            for(var i =0; i<docs.length; i++) {
              var comicSet = docs[i];
              if (comicSet.title === comicSetTitle) {
                var imageList = comicSet.imageList;
                for (var k = 0; k < imageList.length; k++) {
                    var image = imageList[k];
                    var imageUrl = image.imageUrl;
                    image.imageUrl = "../" + imageUrl;
                }
                var title = comicSet.title;
                if (i > 0) {prevSet = docs[i-1].title}
                if (i < docs.length - 1) {nextSet = docs[i + 1].title}
                break;
              }
            }            
            res.render('comic_page', {
               "title":title,
               "imageList" : imageList,
               "nextSetTitle" : nextSet || "",
               "prevSetTitle" : prevSet || ""
            });
        });
    });


    /* Get Edit Comics page. */
    router.get('/edit_comic', function (req, res) {
      var db = req.db;
      var collection = db.get('uploadedImages');
      collection.find({},{},function(e,docs){
        var imageList = [];
        for (var image of docs) {
          if (image.comicSetTitle == "") imageList.push(image);
        }
        res.render('edit_comic', {
          "imageList" : imageList
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
            db.get("uploadedImages").update({comicSetTitle: ""}, {$set: {comicSetTitle: req.body.comicSetTitle}}, function (err) {
                console.log("uploaded images updated");
                res.send({ redirect: '/' });
            });
        }
      });
    });

    this.router = router;
  }

}
var router = new Router();
module.exports = router.router;
