#Dd Donations API

This service is designed to work with Stripe from a static website.

A GET request to /donate with a Stripe Card token will result in the card being charged.

It will correctly respond to a JSONP request from a browser, and return a JSON of the Stripe Charge object.