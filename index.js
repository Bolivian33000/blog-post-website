// Imports all packages required for running an application on a server using Node.js and EJS
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override"; // Imports method-override to support PUT and DELETE methods in forms

const __dirname = dirname(fileURLToPath(import.meta.url)); // Determines the directory name of the current module


const app = express(); // Initializes an Express application
const port = 3000; // Sets the port number for the server

// allows us to serve static files from the public folder
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(methodOverride('_method')); // Middleware to override HTTP methods (to support PUT and DELETE in forms)


let blogPosts = []; // Array to store each blog post
let idCounter = 1; // Counter to assign unique IDs to blog posts

// GET request to display the contents of index.ejs (EJS is used to run a dynamic HTML script)
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// POST request to create a post by extracting the title and content attributes from the user's input
app.post("/create_post", (req, res) => { // route handler for the "create_post" endpoint
  let title = req.body.title;
  let content = req.body.content;
  
  const newPost = {
    id: idCounter++, // Assigns a unique ID to each post
    title: title,
    content: content
  };
  blogPosts.push(newPost); // Adds the new post to the blogPosts array
  res.render("index.ejs", { blogPosts: blogPosts }); // Renders the index.ejs template and passes all blog posts to the template
});

// DELETE request to remove a post by its ID
app.delete("/delete/:id", (req, res) => {
  const blogPostID = parseInt(req.params.id, 10); // Converts the string ID from the URL to a base 10 integer
  const postIndex = blogPosts.findIndex(post => post.id === blogPostID); // Finds the index of the post with the matching ID

  if (postIndex !== -1) { // If a matching post is found (index is not -1)
    blogPosts.splice(postIndex, 1); // Removes one post from the array at the position indicated by postIndex
    res.render('index.ejs', { blogPosts: blogPosts }); // Renders the index.ejs template with the updated blogPosts array
  } else {
    res.status(404).json({ error: "Post not found" }); // Sends a 404 error response if no matching post is found
  }
});

// PUT request to edit a post by its ID
app.put('/edit/:id', (req, res) => {
  let title = req.body.title;
  let edit_content = req.body.edit_content; // The edit_content portion is the "name" attribute of the text area

  console.log("This is content:" + edit_content);
  
  const blogPostID = parseInt(req.params.id, 10); // Converts the string ID from the URL to a base 10 integer
  const postIndex = blogPosts.findIndex(post => post.id === blogPostID); // Finds the index of the post with the matching ID

  const editedPost = { // new data structure (editedPost)
    id: blogPostID, // Retains the same ID for the edited post
    title: title,
    content: edit_content // Keeps the property name consistent with the original blogPost structure
  };

  console.log("This is the edited post:", editedPost);
  if (postIndex !== -1) { // If a matching post is found (index is not -1)
    blogPosts.splice(postIndex, 1, editedPost); // Replaces the post at postIndex with the editedPost
    res.render("index.ejs", { blogPosts: blogPosts }); // Renders the index.ejs template with the updated blogPosts array
  } else {
    res.status(404).json({ error: "Post not found" }); // Sends a 404 error response if no matching post is found
  }
});

// Starts the server and listens on the specified port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
