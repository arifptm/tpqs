const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user.js');
const config = require('./config.js')

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.jwtSecret
}, (payload, done)=>{
  const user = User.findById(payload.uid)
  .then(res=>{    
    if(!res){
      return done(null, false)
    } else {
      return done(null, res)
    }
  })
}));

passport.use(new LocalStrategy({  
}, (username, password, done)=>{
  User.findOne({username})
  .then(user => {
    if(!user) {
      return done(null, false)
    } else {
      const ifMatch = user.isValid(password)      
      if(!ifMatch){
        return done(null, false)
      } else {
        return done(null, user)
      }      
    }
  })
}));
