require 'sinatra'
require 'sinatra/json'
require 'stripe'
require 'rack/contrib/jsonp'
require 'rack/ssl-enforcer'

#Force SSL in production
if production?
  use Rack::SslEnforcer
end

#Set Stripe secret and publishable keys from environment variables
set :publishable_key, ENV['PUBLISHABLE_KEY']
set :secret_key, ENV['SECRET_KEY']
Stripe.api_key = settings.secret_key

#Don't know why ip_spoofing is turned off, 
#this is from https://stripe.com/docs/checkout/guides/sinatra
set :protection, except: :ip_spoofing

#Rack middleware to detect JSONP
use Rack::JSONP

get '/' do
  erb :index
end

get '/donate' do
  # Amount in cents
  @amount = 500

  customer = Stripe::Customer.create(
    :email => 'customer@example.com',
    :card  => params[:stripeToken]
  )

  charge = Stripe::Charge.create(
    :amount      => @amount,
    :description => 'Sinatra Charge',
    :currency    => 'usd',
    :customer    => customer.id
  )
  
  json charge, :encoder => :to_json
end

error Stripe::CardError do
  env['sinatra.error'].message
end