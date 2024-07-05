import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
	const { hypercertId, contactInfo, image } = await req.json();

	// Configure the email transporter
	const transporter = nodemailer.createTransport({
		service: "gmail", // You can use any email service
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	// Set up email data
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: "holke@hypercerts.org",
		cc: "mark@r0wdy.dev",
		subject: "New Hypercert created for Edge Esmeralda",
		text: `A new hypercert has been created for Edge Esmeralda!
		Hypercert ID: ${hypercertId}
		Contact Info: ${contactInfo}
		 Please review the hypercert and move it to approved in the google sheet.`,
		html: `<div>
						<h1>A new hypercert has been created for Edge Esmeralda!</h1>
						<p>Hypercert ID: ${hypercertId}</p>
						<p>Contact Info: ${contactInfo}</p>
		 				<p>Please review the hypercert and move it to approved in the google sheet.</p>
		 			</div>`,
		amp: `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
      </head>
      <body>
        <h1>Hello!</h1>
        <p>A new hypercert has been created for Edge Esmeralda!</p>
        <p>Here's the link to your hypercert: <a href="#">Link to hypercert here</a></p>
        <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
        <p>Best regards,</p>
        <p>The Hypercerts team</p>
        <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
      </body>
    </html>`,
	};

	try {
		await transporter.sendMail(mailOptions);

		return NextResponse.json({ success: true });
	} catch (error) {
		// Log error and return 500 status code with the error message
		return NextResponse.json(error, { status: 500 });
	}
}
