const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'bookexchange.org@gmail.com',
        pass: 'zehjnnjufkgisety'
    }
})

const sendMail = async (from, to, book) => {
    console.log(from, to, book)
    try {
        const response = await transporter.sendMail({
            from: 'bookexchange.org@gmail.com',
            to: to,
            subject: `BookExchangeRequest | For your book "${book}"`,
            text: 'Hey, would you like to exchange your book?'
        })
        console.log(response.response)
    } catch (e){
        console.log(e.message)
    }
}

module.exports = sendMail