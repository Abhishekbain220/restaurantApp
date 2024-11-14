let nodemailer = require("nodemailer")
exports.sendMailCustomer = (user, table, res) => {
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
        subject: "Table Booking reciept", // Subject line
        html: `<h1> Customer:- ${user.username}</h1>
                <h2>Members:- ${table.members}</h2>
                <h2>Date:- ${table.date}</h2>
                <h1>Time</h1>
                <h2>From:- ${table.from}</h2>
                <h2>To:- ${table.to}</h2>`, // html body
    }

    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.send(err.message)
        }
        return (
            res.send("check Your Email")
            
        )
    })
}