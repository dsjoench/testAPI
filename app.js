const express = require("express");
const bodyParser =  require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const app = express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded(
    {
        extended:true
    }
));

app.use(express.static("public"));

// create mongoose connection
mongoose.connect("mongodb://test:test@localhost:27017/wikiDB?authSource=admin");

const articleSchema = {
    title: String,
    content:String

}

// create article model
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(
    function(req, res){
        Article.find(function(err,foundArticle){

        if (!err){
            res.send(foundArticle)
        }
        else{
            res.send(err);
        }
        })
        
    })

.post(function(req,res){


    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    })

    newArticle.save(function(err){
        if (!err){
            res.send("Successfully added a new article");
        }else{
            res.send(err);
        }
       
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if (!err){
            res.send("Successfully delete all doc");
        }else{
            res.send(err);
        }
    })

});


app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne(
        {title:req.params.articleTitle},function(err,foundArticle){
            if (!err){
                if (foundArticle){
                    res.send(foundArticle)
                }
                else{
                    res.send("No article was found")
                }
                
            }
            else{
                res.send(err)
            }
        }
    )
}
    
)
.put(function(req,res){
    Article.updateOne(
        
        {title: req.params.articleTitle},
        {
            title:req.body.title, 
            content: req.body.content
        },
        {

            upsert:true
        },
        function(err){
            if (!err){
      
                res.send("Successfully update article")
            }
        });
})
.patch(function(req,res){
    Article.updateOne({
        title:req.params.articleTitle
    },
    {
        $set:req.body
    },
    function(err){
        if(!err){
            res.send("Successfully updated article")
        }else{
            res.send(err);
        }
    })
})
.delete(function(req,res){
    Article.deleteOne({
        title:req.params.articleTitle
    },

        function(err){
            if (!err){
                res.send("Successfully delete")
            }else{
                res.send(err)
            }
        }
    )
});


app.listen(3000,function(){
    console.log("Starting on port 3000");
})
