const nodemailer = require("nodemailer");

module.exports = {
  async sendMail(email, pet) {
    // mail SMTP settings
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    // email content
    const mailOptions = {
      from: `"petesPets 🐕 " <${process.env.GMAIL_USERNAME}>`, // sender address
      to: `${email}`, // list of receivers
      subject: "Pet Purchased 💵", // Subject line
      text: `Congrats on your new pet, ${pet.name}! You Paid ${pet.price}.`, // plain text body
      html: `<p>Congrats on your new pet, ${pet.name}!</p>
      <div style='margin-top:10px'>
        <p>You Paid ${pet.price}.</p>
        <p>Proud Pete's Pet Emporium thanks you!</p>
      </div>
      ` // html body
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log(error);
    });
  }
};