import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

function generateId () {
  return +new Date();
}

let posts = [];

// Route to home page to view posts
app.get("/", (req, res) => {
  res.render("index.ejs", {
    posts: posts,
  });
})

// Route to create a new post
app.get('/new-post', (req, res) => {
  res.render('new-post.ejs');
});

// Handle new post submission
app.post("/new-post", (req, res) => {
  const newPost = {
    id: generateId(),
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);    
  res.redirect("/"); 
})

// Edit a post (GET a form)
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if(post) {
    res.render("edit-post.ejs", {post});
  } else {
    res.status(404).send("post not found");
  }
});

//Update a post (PUT request)
app.put("/posts/:id", (req,res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);

  if(post) {
    post.title = req.body.title;
    post.content = req.body.content;
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});

// Delete a post (DELETE request)
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(p => p.id !== id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Your port is running on ${port}`)
})