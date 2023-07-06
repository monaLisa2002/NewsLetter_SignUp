const express=require("express");
const bodyParser=require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app=express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

//setting up mailchimp


app.post("/",function(req,res){
    var firstName=req.body.firstName;
    var lastName=req.body.lastName;
    var mail=req.body.mail;
    console.log(firstName+", "+lastName+","+mail);
    mailchimp.setConfig({
        apiKey: "58835d5297c483b4166dd9b2dd57a578-us21",
        server: "us21",
      });
      
      const subscribingUser = {
          firstName: firstName, 
          lastName: lastName, 
          email: mail
      }

      async function run() {

        try{
            const response = await mailchimp.lists.addListMember("0799cfd5e6", {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
              });
              res.sendFile(__dirname+"/success.html");
              console.log("Success");

        }
        catch(e){
            console.log("====== ERROR ======");
            console.log(JSON.parse(e.response.error.text).detail);
            res.sendFile(__dirname+"/failure.html");
        }
       
      };

      run()
       
      });
    
app.post("/failure",function(req,res){
    //res.sendFile(__dirname+"/signup.html");
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("server running");
});


/* 58835d5297c483b4166dd9b2dd57a578-us21 
aud id 0799cfd5e6.*/







