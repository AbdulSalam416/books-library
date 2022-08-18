const express = require("express");
const  app= express();
const port= 3000||process.env.PORT
const fs= require("fs")
const { error } = require("console");
const crypto = require("crypto")


app.use(express.json());

// Retrieving books.json using get request

app.get("/books", (req,res)=>{
    res.send(getBooks())
})


// Adding book using Post request

app.post("/book",(req,res)=>{

    const books=getBooks();
    const id = crypto.randomBytes(3).toString("hex");

    const uniqueID= {"ID": id}


    const addedBook = req.body


    if(addedBook.title==null || addedBook.autor==null||addedBook.isbn_num==null|| addedBook.pagesNum==null){
          return res.status(401).send({error:true, msg: "Missing Data"})
    }
    

    const bookExist = books.find(book=> book.isbn_num===addedBook.isbn_num)

    if (bookExist){
      res.status(409).send({error:true, msg: "Book already exist in the library"})

    }

    const bookToAdd ={...uniqueID,...addedBook}
            
    books.push(bookToAdd);
    saveBook(books)
    res.send({success:true, msg:"Book added sucessfully"})


} )

// Editing the details of a book using the Patch request

app.patch('/book/:id', (req, res) => {

    let newId = req.params.id;
    const books= getBooks();


    const book = books.find(book => book.ID ===(newId));
    if (!book) return res.status(404).json({ message: 'Book Not Found' });
  

    const updateBooks= books.filter(book => book.ID!==newId)

    updateBooks.push(req.body)

    saveBook(updateBooks)
    res.status(200).send(`Succesfully updated the book with ID: ${newId}`)

  
  });

  //Deleting book with ID using Delete Request 

  app.delete('/book/:id', (req, res) => {

    let newId = req.params.id;
    const books= getBooks();

    const updateBooks= books.filter(book => book.ID!==newId)
    if (updateBooks.length===books.length){
        res.status(409).send({error: true, msg: 'Book ID does not exist'})
    }

    saveBook(updateBooks)

    res.status(200).send(`Succesfully Deleted the book with ID: ${newId}`)





  })


// Using fs to save changes to books.json

 function saveBook(data) {

    let newJson = JSON.stringify(data)

return fs.writeFile('books.json',newJson, (err)=>{
    
    if(err) throw err;

})}

// Using fs to access books.js

const getBooks = () => {
    const jsonData = fs.readFileSync('books.json')
    return JSON.parse(jsonData)    
}
    
app.listen(port, ()=> console.log("listening to port 3000!") )


