///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>
var User = (function () {
    function User(name, password) {
        this.name = name;
        this.password = password;
    }
    User.prototype.getName = function () {
        return this.name;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    return User;
})();
var Router = (function () {
    function Router() {
        var express = require('express');
        var router = express.Router();
        var session = require('express-session');
        var multer = require('multer');
        var upload = multer({ dest: './public/uploads' });
        var aws = require('aws-sdk');
        var AWS_ACCESS_KEY = "AKIAI3H44R3RLQDET4ZA";
        var AWS_SECRET_KEY = "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";
        /*Middlewear for Session */
        router.use(session({ secret: 'randomstring',
            saveUninitialized: true,
            resave: true }));
        /* GET login page. */
        router.get('/login', function (req, res, next) {
            res.render('login', { title: 'Login' });
        });
        router.post('/login', function (req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            collection.findOne({ username: req.body.username }, function (err, user) {
                if (!user) {
                    res.send('Invalid username or password');
                }
                else {
                    if (req.body.userpassword === user.password) {
                        if (req.session.loggedin === 1) {
                            res.send("Please Logout before signing in");
                        }
                        else {
                            req.session.loggedin = 1;
                            req.session.username = user.username;
                            res.redirect('/');
                        }
                    }
                    else {
                        res.send('Invalid username or password');
                    }
                }
            });
        });
        /* GET signup page. */
        router.get('/sign_up', function (req, res, next) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var comicSetTitle 
            collection.find({}, {}, function (err, docs) {
                //var x = Math.random() * (docs.length - 1) + 1;
                var x = 1;
                var comicSet = docs[x];
                var comicSetTitle = comicSet.title;

            res.render('sign_up', { title: 'Sign Up',
                                    randomComic: comicSetTitle  });
        });
        });

        /* POST to Add User Service */
        router.post('/sign_up', function (req, res) {
            // Set our internal DB variable
            var db = req.db;
            // Get our form values. These rely on the "name" attributes
            var newUser = new User(req.body.username, req.body.userpassword);
            // Set our collection
            var collection = db.get('usercollection');
            // Submit to the DB
            collection.findOne({ username: req.body.username }, function (err, user) {
                if (user) {
                    res.send('Username exists');
                }
                else if (req.body.userpassword.length < 8) {
                    res.send('Password is too short');
                }
                else {
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
                            req.session.loggedin = 1;
                            req.session.username = req.body.username;
                            res.redirect('/');
                        }
                    });
                }
            });
        });
        /* GET Userlist page. */
        router.get('/userlist', function (req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            collection.find({}, {}, function (e, docs) {
                res.render('userlist', {
                    "userlist": docs
                });
            });
        });
        /*Get Log_out page */
        router.get('/logout', function (req, res) {
            req.session.destroy();
            res.redirect('/');
        });
        /* GET Home page. */
        router.get('/', function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var comicSetList = [];
            var titleList = [];
            collection.find({}, {}, function (e, docs) {
                for (var i = 0; i < docs.length; i++) {
                    comicSetList[i] = docs[i];
                    titleList[i] = docs[i].title;
                }
                res.render('home_page', {
                    "indicator": 0,
                    "comicSetList": comicSetList,
                    "titleList": titleList,
                    "loggedin": req.session.loggedin,
                    "username": req.session.username
                });
            });
        });
        /* Home Page Searching */
        router.post('/', function (req, res) {
            //var db = req.db;
            //var collection = db.get('uploadedSets');
            //collection.find({},{},function(e,docs){
            var searchComic = req.body.searchComic;
            if (searchComic !== '')
                res.send({ redirect: '/home/' + searchComic });
            else
                res.redirect('/');
            res.render('home_page', {
                //"comicSets":docs,
                //"astar": undefined,
                "loggedin": req.session.loggedin,
                "username": req.session.username
            });
            //});
        });
        /* Get Home Page after Searching. */
        router.get('/home/:comic_set_title', function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var comicSetTitle = req.params.comic_set_title;
            var findComicSet = [];
            collection.find({}, {}, function (err, docs) {
                for (var i = 0, j = 0; i < docs.length; i++) {
                    if ((docs[i].title).indexOf(comicSetTitle) > -1) {
                        findComicSet[j] = docs[i];
                        j++;
                    }
                }
                if (j == 0) {
                    res.render('home_page', {
                        "userInput": comicSetTitle,
                        "indicator": 1
                    });
                }
                else {
                    res.render('home_page', {
                        "indicator": 0,
                        "comicSetList": findComicSet
                    });
                }
            });
        });
        /* Update ComicSet rating */
        router.post("/updateRating", function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var UserRating = req.body.UserRating;
            var title = req.body.title;
            // var newrating = 0;
            var numberOfRate = req.body.numberOfRate + 1;
            var totalRate = req.body.totalRate + UserRating;
            collection.update({ title: title }, { $set: { numberofR: numberOfRate, totalRate: totalRate, avgRate: totalRate / numberOfRate } }, function (err) {
                console.log("Rating for " + title + " updated");
            });
        });
        /* Get Comic page. */
        router.get('/comic_page/:comic_set_title', function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var comicSetTitle = req.params.comic_set_title;
            collection.find({}, {}, function (err, docs) {
                var nextSet = undefined;
                var prevSet = undefined;
                for (var i = 0; i < docs.length; i++) {
                    var comicSet = docs[i];
                    if (comicSet.title === comicSetTitle) {
                        var imageList = comicSet.imageList;
                        for (var k = 0; k < imageList.length; k++) {
                            var image = imageList[k];
                            var imageUrl = image.imageUrl;
                            //image.imageUrl = "../" + imageUrl;
                        }
                        var title = comicSet.title;
                        if (i > 0) {
                            prevSet = docs[i - 1].title;
                        }
                        if (i < docs.length - 1) {
                            nextSet = docs[i + 1].title;
                        }
                        break;
                    }
                }
                res.render('comic_page', {
                    "title": title,
                    "imageList": imageList,
                    "nextSetTitle": nextSet || "",
                    "prevSetTitle": prevSet || ""
                });
            });
        });
        /* Get Edit Comics page. */
        router.get('/edit_comic', function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedImages');
            collection.find({}, {}, function (e, docs) {
                var imageList = [];
                for (var _i = 0; _i < docs.length; _i++) {
                    var image = docs[_i];
                    if (!image.isImageInUse)
                        imageList.push(image);
                }
                res.render('edit_comic', {
                    "title": "undefined",
                    "imageList": imageList
                });
            });
        });
        /* Get Edit Comic Page with existing comic set. */
        router.get('/edit_comic/:comic_set_title', function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var comicSetTitle = req.params.comic_set_title;
            collection.find({}, {}, function (err, docs) {
                var nextSet = undefined;
                var prevSet = undefined;
                for (var i = 0; i < docs.length; i++) {
                    var comicSet = docs[i];
                    if (comicSet.title === comicSetTitle) {
                        var imageList = comicSet.imageList;
                        for (var k = 0; k < imageList.length; k++) {
                            var image = imageList[k];
                            var imageUrl = image.imageUrl;
                            //image.imageUrl = "../" + imageUrl;
                        }
                        var title = comicSet.title;
                        if (i > 0) {
                            prevSet = docs[i - 1].title;
                        }
                        if (i < docs.length - 1) {
                            nextSet = docs[i + 1].title;
                        }
                        break;
                    }
                }
                res.render('edit_comic', {
                    "title": title,
                    "imageList": imageList
                });
            });
        });
        /* Get Manage Comics page. */
        router.get('/manage_comics', function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var userloggingin = req.session.username;
            var comicSets = [];
            collection.find({}, {}, function (err, docs) {
                for (var i = 0; i < docs.length; i++) {
                    var comicSet = docs[i];
                    if (comicSet.uploadedby === userloggingin) {
                        comicSets.push(comicSet);
                    }
                }
                res.render('manage_comics', {
                    "comicSets": comicSets
                });
            });
        });
        /* Save image to database*/
        router.post('/upload', upload.single("image"), function (req, res) {
            var fs = require("fs");
            var oldPath = req.file.path;
           
            var newPath = oldPath + '.jpg';
            
            console.log(newPath);
            var title = req.body.title == "undefined" ? undefined : req.body.title;
            aws.config.update({accessKeyId: 'AKIAI3H44R3RLQDET4ZA', secretAccessKey: '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'});
            var s3bucket = new aws.S3({
             params: {Bucket: 'phocascomicsstorage'}
            });

            var params = {Key: newPath, Body: ''};
            
           
            fs.readFile(req.file.path, function(err, data) {
              if (err) throw err;
            params.Body = data;

            s3bucket.putObject(params, function(errBucket, dataBucket) {
             if (errBucket) {
                 console.log("Error uploading data: ", errBucket);
                } else {
                 console.log(dataBucket);
                 
          }
      });
    });

            var url = 'https://s3-us-west-2.amazonaws.com/phocascomicsstorage/' + newPath;
            console.log(url);
            fs.rename(oldPath, newPath, function () {
                var db = req.db;
                // Set our collection
                var uploadedSets = db.get("uploadedSets");
                var imageData;
                if (title) {
                    imageData = {
                        "isImageInUse": true,
                        "imagePosition": unusedImages + 1,
                        "imageUrl": url
                    };
                }
                else {
                    imageData = {
                        "isImageInUse": false,
                        "imagePosition": unusedImages + 1,
                        "imageUrl": url
                    };
                }
                var collection = db.get('uploadedImages');
                var unusedImages = 0;
                collection.insert(imageData, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        res.send("There was a problem adding the information to the database.");
                    }
                    else {
                        if (title) {
                            uploadedSets.findOne({ title: title }, function (err, comicSet) {
                                if (comicSet) {
                                    var imageList = comicSet.imageList;
                                    imageList.push(imageData);
                                    uploadedSets.update({ title: title }, { $set: { imageList: imageList } }, function (err) {
                                        console.log("comic set updated");
                                    });
                                }
                                else if (err) {
                                    res.send("There was a problem adding the information to the database.");
                                }
                            });
                            res.redirect("edit_comic/" + title);
                        }
                        else
                            res.redirect('edit_comic');
                    }
                });
            });
        });
        router.post('/uploadComicSet', function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var imageList = req.body.imageList;
            // Submit to the DB
            collection.insert({
                "title": req.body.comicSetTitle,
                "imageList": req.body.imageList,
                "uploadedby": req.session.username,
                "numberofR": 0,
                "totalRate": 0,
                "avgRate": 0
            }, function (err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                }
                else {
                    // And forward to success page
                    console.log("saved");
                    var uploadedImages = db.get("uploadedImages");
                    for (var i = 0; i < imageList.length; i++) {
                        var image = imageList[i];
                        uploadedImages.update({ imageUrl: image.imageUrl }, { $set: { isImageInUse: true } }, function (err) {
                            console.log("image updated");
                        });
                    }
                    res.send({ redirect: "/" });
                }
            });
        });
        router.post("/updateComicSet", function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var oldTitle = req.body.oldComicSetTitle;
            var newTitle = req.body.newComicSetTitle;
            var imageList = req.body.imageList;
            // Submit to the DB
            collection.update({ title: oldTitle }, { $set: { title: newTitle, imageList: imageList } }, function (err) {
                console.log("comic set updated");
            });
            res.send({ redirect: "/" });
        });
        router.delete('/deleteComicImage', function (req, res) {
            var db = req.db;
            var collection = db.get('uploadedSets');
            var title = req.body.comicSetTitle;
            var imageUrl = req.body.imageUrl;
            var comicSet = collection.findOne({ title: title }, function (err, comicSet) {
                if (comicSet) {
                    var imageToDelete;
                    var imageList = comicSet.imageList;
                    for (var i = 0; i < imageList.length; i++) {
                        if (imageList[i].imageUrl.indexOf(imageUrl) > -1) {
                            imageToDelete = i;
                            break;
                        }
                    }
                    imageList.splice(imageToDelete, 1);
                    collection.update({ title: title }, { $set: { imageList: imageList } }, function (err) {
                        console.log("comic set updated");
                        res.send({ redirect: title });
                    });
                }
                else if (err) {
                    res.send("There was a problem deleting the image");
                }
            });
        });
        this.router = router;
    }
    return Router;
})();
var router = new Router();
module.exports = router.router;
//# sourceMappingURL=index.js.map