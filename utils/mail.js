let nodemailer = require("nodemailer")
exports.sendMail = (user, url, res) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "abhishekbain220@gmail.com",
            pass: "spxhjuqaqceroqed",
        },
    });
    let mailOptions = {
        from: "Abhishek Bain 10",
        to: user.email,
        subject: "Password Reset Link", // Subject line
        html: `<h1> Click the Link Below</h1> 
                <a href="${url}">Reset Password Link</a>`, // html body
    }

    transport.sendMail(mailOptions,(err,info)=>{
        if(err){
            res.send(err.message)
        }
        return (
            
            res.send("Check Your Email")
        )
    })
}