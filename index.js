import express from 'express'
import pg from 'pg'
import bodyParser from "body-parser"; 


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3000;

  
    const db = new pg.Client({
        user: 'postgres',
        host: 'localhost',
        database: "world",
        password: "Postgres123",
        port: 5432,
    });
    db.connect();

    let data = [];
    db.query("SELECT * FROM capitals", (err, res) => {
      if (err) {
        console.error("Error executing query", err.stack);
      } else {
        data = res.rows;
      }
      db.end();
    });

   let randomRecord = {};
   let totalscore=0;
 


app.get("/", async (req, res) => {


  totalscore = 0;

  await randomquestion();

  console.log(randomRecord.country)

  res.render("index.ejs", {country: randomRecord.country , score: totalscore});

});



app.get("/send-answer", async (req, res) => {


  totalscore = 0;

  res.render("final.ejs", { score: totalscore });

});


app.post("/send-answer", (req, res) => {

  

  let isCorrect = false;

 if (req.body.answer.trim().toLowerCase() === randomRecord.capital.toLowerCase() )

 {

  console.log("correct")
  totalscore++; 
  isCorrect = true;
  console.log(totalscore)
  randomquestion();
  res.render("index.ejs", {country: randomRecord.country, score: totalscore, wascorrect: isCorrect }); 

 }

 else {

  console.log("your totalscore" + totalscore)

  res.render("final.ejs", { score: totalscore });

 }

  

     
});
  
    
async function randomquestion(){
    const randomcountry = data[Math.floor(Math.random() * data.length )];
    randomRecord = randomcountry;

  }

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});